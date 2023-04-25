import {
  SelectionMode,
  ShimmeredDetailsList,
  DetailsListLayoutMode,
} from "@fluentui/react";

export default function Table(props: any) {
  return (
    <div
      style={{
        height: "40vh",
        maxWidth: "90vw",
        minWidth: "70vw",
        overflow: "auto",
      }}
    >
      <ShimmeredDetailsList
        getKey={props.getKey}
        items={props.items || []}
        columns={props.columns}
        selectionMode={SelectionMode.none}
        enableShimmer={props.isLoading}
        onActiveItemChanged={props.onActiveItemChanged}
        activeItemKey={props.activeItemKey}
        layoutMode={DetailsListLayoutMode.justified}
        {...props}
        setKey={props.setKey}
      />
    </div>
  );
}
