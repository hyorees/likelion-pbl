export interface Lion {
  id: string;
  name: string;
  part: string;
  intro: string;
  email: string;
  phone: string;
  website: string;
  skills: string[];
  motto: string;
  oneLiner: string;
  isMe: boolean;
}

export interface FormDataState {
  name: string;
  part: string;
  skills: string;
  oneLiner: string;
  intro: string;
  email: string;
  phone: string;
  website: string;
  motto: string;
}