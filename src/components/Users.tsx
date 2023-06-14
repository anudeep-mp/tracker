import {
  IColumn,
  SelectionMode,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
  DetailsListLayoutMode,
  ChoiceGroup,
  IChoiceGroupOption,
  Modal,
  DefaultButton,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from "react";
import { ISession, IUser } from "../interfaces/interface";
import Table from "./Table";

import DeleteIcon from "../assets/delete.png";

export default function Users() {
  const renderTimeSpent = (time: number) => {
    const hours = time / 3600;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.floor(minutes);
    const seconds = (minutes - rminutes) * 60;
    const rseconds = Math.round(seconds);

    return (
      <span>
        {rhours > 0 && <span>{rhours}hr </span>}
        {rminutes > 0 && <span>{rminutes}min </span>}
        <span>{rseconds}s</span>
      </span>
    );
  };

  const renderDate = (date: string) => {
    return <span>{new Date(date).toLocaleString()}</span>;
  };

  const deleteUser = () => {
    if (!deletePromtUser?.id) return;
    hideModal();
    setUserDeletionPassword("");
    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: {
        Method: "DELETE",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "*/*",
        Environment: environmentOption,
      },
    };
    fetch(
      `${process.env.API_ENDPOINT}/watchstamp/${deletePromtUser?.id}`,
      requestOptions
    ).then((response) => {
      if (response.ok) {
        const newUsers = users.filter((u) => u.id !== deletePromtUser?.id);
        setUsers(newUsers);
        setSelectedUserId(newUsers[0].userId);
      }
    });
  };

  const renderDeleteUserIcon = (item: IUser) => {
    return (
      <img
        src={DeleteIcon}
        style={{
          width: "20px",
          height: "20px",
          cursor: "pointer",
          zIndex: 100,
        }}
        onClick={() => {
          showModal();
          setDeletePromptUser(item);
        }}
      />
    );
  };

  const columns: IColumn[] = [
    {
      key: "userId",
      name: "User ID",
      fieldName: "userId",
      minWidth: 200,
      maxWidth: 300,
    },
    {
      key: "sessionCount",
      name: "Session count",
      fieldName: "sessionCount",
      minWidth: 200,
      maxWidth: 300,
    },
    {
      key: "createdAt",
      name: "First seen",
      fieldName: "createdAt",
      minWidth: 200,
      maxWidth: 300,
      onRender: (item: IUser) => renderDate(item.createdAt),
    },
    {
      key: "lastSeenAt",
      name: "Last seen",
      fieldName: "lastSeenAt",
      minWidth: 200,
      maxWidth: 300,
      onRender: (item: IUser) => renderDate(item.lastSeenAt),
    },
    {
      key: "totalTimeSpent",
      name: "Totel time spent",
      fieldName: "totalTimeSpent",
      minWidth: 200,
      maxWidth: 300,
      onRender: (item: IUser) => renderTimeSpent(item.totalTimeSpent),
    },
    {
      key: "deleteUser",
      name: "Delete user",
      fieldName: "deleteUser",
      minWidth: 150,
      maxWidth: 150,
      onRender: renderDeleteUserIcon,
    },
  ];

  const sessionColumns: IColumn[] = [
    {
      key: "userId",
      name: "User ID",
      fieldName: "userId",
      minWidth: 150,
      maxWidth: 250,
    },
    {
      key: "sessionId",
      name: "Session ID",
      fieldName: "sessionId",
      minWidth: 150,
      maxWidth: 250,
    },
    {
      key: "timeStampsCount",
      name: "Timestamps count",
      fieldName: "timeStampsCount",
      minWidth: 150,
      maxWidth: 150,
    },
    {
      key: "sessionStart",
      name: "Session start",
      fieldName: "sessionStart",
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: ISession) => renderDate(item.sessionStartedAt),
    },
    {
      key: "sessionEnd",
      name: "Session end",
      fieldName: "sessionEnd",
      minWidth: 150,
      maxWidth: 250,
      onRender: (item: ISession) => renderDate(item.sessionEndedAt),
    },
    {
      key: "sessionDuration",
      name: "Session duration",
      fieldName: "sessionDuration",
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: ISession) => renderTimeSpent(item.sessionDuration),
    },
  ];

  const options: IChoiceGroupOption[] = [
    { key: "prod", text: "Production" },
    { key: "uat", text: "UAT" },
  ];

  const [users, setUsers] = useState<IUser[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sessionItems, setSessionItems] = useState<ISession[]>([]);
  const [environmentOption, setEnvironmentOption] = useState<string>("prod");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deletePromtUser, setDeletePromptUser] = useState<IUser>();
  const [userDeletionPassword, setUserDeletionPassword] = useState<string>("");

  const { isLoading, isError, errorMessage, data } = useFetch(
    `${process.env.API_ENDPOINT}/watchstamps`,
    environmentOption,
    false,
    10000
  );

  useEffect(() => {
    let tempSessionItems: ISession[] =
      users.find((u) => u.userId === selectedUserId)?.sessions || [];
    setSessionItems(sortByDate(tempSessionItems, "sessionStartedAt"));
  }, [selectedUserId, users]);

  useEffect(() => {
    if (!isLoading && !isError && data && data.isSuccess) {
      const modifiedUsers = sortByDate(
        filterArrayByUniqueProperty(data.result.users),
        "lastSeenAt"
      );
      setUsers(modifiedUsers);
      setUserCount(modifiedUsers.length);
      console.log(modifiedUsers);
      !selectedUserId && setSelectedUserId(data.result?.users[0]?.userId);
    }
  }, [isLoading, isError, data]);

  function filterArrayByUniqueProperty(arr: IUser[]) {
    const uniqueValues: any = {};

    arr.forEach((obj) => {
      const value = obj.userId;

      if (!(value in uniqueValues)) {
        uniqueValues[value] = obj;
      }
    });

    return Object.values(uniqueValues);
  }

  const sortByDate = (arr: any, key: string) => {
    return arr.sort((a: any, b: any) => {
      return new Date(b[key]).getTime() - new Date(a[key]).getTime();
    });
  };

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="start"
      tokens={{ childrenGap: 30 }}
    >
      <Stack>
        <ChoiceGroup
          defaultSelectedKey={environmentOption}
          options={options}
          onChange={(_, option) =>
            setEnvironmentOption(option?.key || environmentOption)
          }
          required={true}
          styles={{
            flexContainer: {
              display: "flex",
              backgroundColor: "#ffffff",
              padding: "0 10px 5px",
              borderRadius: "5px",
              justifyContent: "space-between",
              width: "180px",
            },
          }}
        />
      </Stack>
      <Stack>
        <Stack>
          <Text
            variant="large"
            style={{
              color: "#fff",
              padding: "10px",
              backgroundColor: "#0078d4",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            User count : {userCount}
          </Text>
        </Stack>
        {isError && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
            <div>{errorMessage}</div>
          </MessageBar>
        )}
        <Table
          items={users || []}
          columns={columns}
          selectionMode={SelectionMode.single}
          selectionPreservedOnEmptyClick={true}
          enableShimmer={isLoading}
          layoutMode={DetailsListLayoutMode.justified}
          onActiveItemChanged={(item: IUser) => {
            setSelectedUserId(item.userId);
          }}
          setKey={selectedUserId}
        />
      </Stack>
      <Stack>
        <Stack tokens={{ childrenGap: 10 }}>
          <Text
            variant="large"
            style={{
              color: "#fff",
              padding: "10px",
              backgroundColor: "#0078d4",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            Session count : {sessionItems.length}
          </Text>
        </Stack>
        <Table
          items={sessionItems || []}
          columns={sessionColumns}
          selectionMode={SelectionMode.none}
          enableShimmer={isLoading}
          layoutMode={DetailsListLayoutMode.justified}
        />
      </Stack>
      <Modal
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        styles={{
          scrollableContent: {
            height: "100%",
          },
          main: {
            height: "250px",
            width: "350px",
          },
        }}
      >
        <Stack verticalFill tokens={{ childrenGap: 20 }} verticalAlign="center">
          <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Text variant="mediumPlus">
              Are you sure you want to delete this user?
            </Text>
            <Text variant="small">User ID : {deletePromtUser?.userId}</Text>
            <Text>
              User has spent{" "}
              {renderTimeSpent(deletePromtUser?.totalTimeSpent || 0)} in your
              platform
            </Text>
            <TextField
              type="password"
              label="Password"
              required
              value={userDeletionPassword}
              onChange={(_, value) => setUserDeletionPassword(value || "")}
            />
          </Stack>
          <Stack horizontal horizontalAlign="space-around" verticalAlign="end">
            <DefaultButton onClick={hideModal} text="Cancel" />
            <PrimaryButton
              onClick={deleteUser}
              text="OK"
              disabled={userDeletionPassword !== "cbgrows"}
            />
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
}
