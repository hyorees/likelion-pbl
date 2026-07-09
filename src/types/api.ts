export interface RandomUserName {
  first: string;
  last: string;
}

export interface RandomUserLogin {
  username: string;
}

export interface RandomUserLocation {
  city: string;
}

export interface RandomUser {
  name: RandomUserName;
  email: string;
  phone: string;
  login: RandomUserLogin;
  nat: string;
  location: RandomUserLocation;
}

export interface RandomUserResponse {
  results: RandomUser[];
}