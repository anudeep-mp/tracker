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
  const millisToMinutesAndSeconds = (millis: number) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
  };

  const renderLastWatchTime = (item: IUser) => {
    const lastSession = item.sessions[item.sessions.length - 1];

    const lastSessionFirstStamp = new Date(lastSession.timeStamps[0]).getTime();
    const lastSessionLastStamp = new Date(
      lastSession.timeStamps[lastSession.timeStamps.length - 1]
    ).getTime();

    const lastWatchTime = millisToMinutesAndSeconds(
      lastSessionLastStamp - lastSessionFirstStamp
    );
    return <span>{lastWatchTime}</span>;
  };

  const renderWatchTime = (session: ISession) => {
    const lastSessionFirstStamp = new Date(session.timeStamps[0]).getTime();
    const lastSessionLastStamp = new Date(
      session.timeStamps[session.timeStamps.length - 1]
    ).getTime();

    const lastWatchTime = millisToMinutesAndSeconds(
      lastSessionLastStamp - lastSessionFirstStamp
    );
    return <span>{lastWatchTime}</span>;
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
      onRender: (item: IUser) => {
        return <span>{item.sessions.length}</span>;
      },
    },
    {
      key: "createdAt",
      name: "Created at",
      fieldName: "createdAt",
      minWidth: 200,
      maxWidth: 300,
      onRender: (item: IUser) => {
        return <span>{new Date(item.createdAt).toLocaleString()}</span>;
      },
    },
    {
      key: "lastSessoionCreatedAt",
      name: "Last session",
      fieldName: "lastSessoionCreatedAt",
      minWidth: 200,
      maxWidth: 300,
      onRender: (item: IUser) => {
        return (
          <span>
            {new Date(
              item.sessions[item.sessions.length - 1].timeStamps[0]
            ).toLocaleString()}
          </span>
        );
      },
    },
    {
      key: "lastWatchTime",
      name: "Latest watch time",
      fieldName: "lastWatchTime",
      minWidth: 200,
      maxWidth: 300,
      onRender: renderLastWatchTime,
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
    },
    {
      key: "sessionEnd",
      name: "Session end",
      fieldName: "sessionEnd",
      minWidth: 150,
      maxWidth: 250,
    },
    {
      key: "watchTime",
      name: "Watch time",
      fieldName: "watchTime",
      minWidth: 150,
      maxWidth: 200,
      onRender: renderWatchTime,
    },
  ];

  const options: IChoiceGroupOption[] = [
    { key: "prod", text: "Production" },
    { key: "uat", text: "UAT" },
  ];

  const [users, setUsers] = useState<IUser[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
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
    tempSessionItems = tempSessionItems?.map((s: ISession) => {
      return {
        ...s,
        sessionStart: new Date(s.timeStamps[0]),
      };
    });
    tempSessionItems = sortByDate(tempSessionItems, "sessionStart");
    tempSessionItems = tempSessionItems?.map((s: ISession) => {
      return {
        ...s,
        timeStampsCount: s.timeStamps.length,
        sessionStart: s["sessionStart"]?.toLocaleString(),
        sessionEnd: new Date(
          s.timeStamps[s.timeStamps.length - 1]
        ).toLocaleString(),
      };
    });
    setSessionItems(tempSessionItems);
  }, [selectedUserId]);

  useEffect(() => {
    if (!isLoading && !isError && data && data.isSuccess) {
      setUsers(sortByDate(data.result.users, "createdAt"));
      setUserCount(data.result.userCount);
      setSelectedUserId(data.result?.users[0]?.userId);
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
