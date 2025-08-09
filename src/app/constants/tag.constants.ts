export const TAG_CONSTANTS = {
  qualifier: [
    {
      label: "min_value",
      type: "text"
    },
    {
      label: "min_items",
      type: "text"
    },
    {
      label: "first_order_only",
      type: "radio",
      values: ["Yes", "No"]
    }
  ],
  benefit: [
    {
      label: "value_type",
      type: "radio",
      values: ["Percent", "Flat"]
    },
    {
      label: "value",
      type: "text"
    },
    {
      label: "value_cap",
      type: "text"
    }
  ],
  meta: [
    {
      label: "auto",
      type: "radio",
      values: ["Yes", "No"]
    },
    {
      label: "additive",
      type: "radio",
      values: ["Yes", "No"]
    },
    {
      label: "priority",
      type: "radio",
      values: ["Yes", "No"]
    }
  ],
};
