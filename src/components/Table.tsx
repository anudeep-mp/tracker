import {
  SelectionMode,
  ShimmeredDetailsList,
  DetailsListLayoutMode,
} from "@fluentui/react";

export default function Table(props: any) {
  return (
    <div
      style={{
        height: "35vh",
        maxWidth: "90vw",
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
