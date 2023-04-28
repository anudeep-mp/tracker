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
} from "@fluentui/react";
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from "react";
import { ISession, IUser } from "../interfaces/interface";
import Table from "./Table";

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

  const { isLoading, isError, errorMessage, data } = useFetch(
    `${process.env.API_ENDPOINT}/watchstamps`,
    environmentOption,
    10000
  );

  useEffect(() => {
    let tempSessionItems: ISession[] =
      users.find((u) => u.userId === selectedUserId)?.sessions || [];
    setSessionItems(sortByDate(tempSessionItems, "sessionStartedAt"));
  }, [selectedUserId, users]);

  useEffect(() => {
    if (!isLoading && !isError && data && data.isSuccess) {
      setUsers(sortByDate(data.result.users, "lastSeenAt"));
      setUserCount(data.result.userCount);
      !selectedUserId && setSelectedUserId(data.result?.users[0]?.userId);
    }
  }, [isLoading, isError, data]);

  const sortByDate = (arr: any, key: string) => {
    return arr.sort((a: any, b: any) => {
      return new Date(b[key]).getTime() - new Date(a[key]).getTime();
    });
  };

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
    </Stack>
  );
}
