export interface VerificationTag {
  code: string;
  list: {
    code: string;
    value: string;
  }[];
}

export interface Descriptor {
  code: string;
  name: string;
}

export interface CredItem {
  id: string;
  descriptor: Descriptor;
  url: string;
  kiranaId: string;
  tags: VerificationTag[];
}
