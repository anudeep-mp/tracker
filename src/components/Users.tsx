import {
  IColumn,
  SelectionMode,
  ShimmeredDetailsList,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
  DetailsListLayoutMode,
} from "@fluentui/react";
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from "react";
import { ISession, IUser } from "../interfaces/interface";
import Table from "./Table";

export default function Users() {
  const { isLoading, isError, errorMessage, data } = useFetch(
    `${process.env.API_ENDPOINT}/watchstamps`
  );

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
      name: "Session xount",
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
      minWidth: 200,
      maxWidth: 300,
    },
    {
      key: "sessionId",
      name: "Session ID",
      fieldName: "sessionId",
      minWidth: 200,
      maxWidth: 300,
    },
    {
      key: "timeStampsCount",
      name: "Timestamps count",
      fieldName: "timeStampsCount",
      minWidth: 200,
      maxWidth: 300,
      onRender: (item: ISession) => {
        return <span>{item.timeStamps.length}</span>;
      },
    },
    {
      key: "watchTime",
      name: "Watch time",
      fieldName: "watchTime",
      minWidth: 200,
      maxWidth: 300,
      onRender: renderWatchTime,
    },
  ];

  const [users, setUsers] = useState<IUser[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [sessionItems, setSessionItems] = useState<ISession[]>([]);

  useEffect(() => {
    setSessionItems(
      users.find((u) => u.userId === selectedUserId)?.sessions || []
    );
  }, [selectedUserId]);

  useEffect(() => {
    if (!isLoading && !isError && data && data.isSuccess) {
      setUsers(data.result.users);
      setUserCount(data.result.userCount);
      setSelectedUserId(data.result.users[0].userId);
    }
  }, [isLoading, isError, data]);

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="start"
      tokens={{ childrenGap: 30 }}
    >
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
