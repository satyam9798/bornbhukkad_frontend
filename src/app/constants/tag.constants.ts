interface TagConstant {
  label: string;
  type: 'text' | 'radio';
  subtype?: 'number' | 'decimal';
  values?: string[];
  defaultValue?: string;
}

export const TAG_CONSTANTS: Record<string, TagConstant[]> = {
  qualifier: [
    {
      label: "min_value",
      type: "text",
      subtype: "decimal"
    },
    {
      label: "min_items",
      type: "text",
      subtype: "number"
    },
    {
      label: "item_count",
      type: "text",
      subtype: "number"
    },
    {
      label: "first_order_only",
      type: "radio",
      values: ["Yes", "No"],
      defaultValue: "No"
    }
  ],
  benefit: [
    {
      label: "value",
      type: "text",
      subtype: "decimal"
    },
    {
      label: "value_cap",
      type: "text",
      subtype: "decimal"
    },
    {
      label: "item_count",
      type: "text",
      subtype: "number"
    },
    {
      label: "item_id",
      type: "text"
    },
    {
      label: "item_value",
      type: "text",
      subtype: "decimal"
    }
  ],
  meta: [
    {
      label: "auto",
      type: "radio",
      values: ["Yes", "No"],
      defaultValue: "No"
    },
    {
      label: "additive",
      type: "radio",
      values: ["Yes", "No"],
      defaultValue: "No"
    }
  ],
};