export interface Offer {
  id?: string;
  active: boolean;
  vendorId: string;
  audienceId: string;
  name: string;
  descriptor: {
    code: string;
    images: string[];
  };
  location_ids: string[];
  item_ids: string[];
  time: {
    label: string;
    range: {
      start: string;
      end: string;
    };
  };
  tags: TagGroup[];
}

export interface TagGroup {
  code: string;
  list: { code: string; value: string }[];
}

export interface Audience {
  id: string;
  name: string;
  rules: Record<string, any>;
}
