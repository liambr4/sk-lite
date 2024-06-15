import { useMsal } from "@azure/msal-react";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { acquireAccessToken } from "../main";
export default class ApiClient {
  account: AccountInfo;
  baseUrl: string = import.meta.env.VITE_API_BASEURL;
  accessToken?: string;
  header: string;
  constructor() {
    const { instance, accounts } = useMsal();
    if (accounts.length > 0)
      this.accessToken = acquireAccessToken(
        instance as PublicClientApplication,
      );
    this.header = `Bearer ${this.accessToken}`;
    this.account = accounts[0];
    console.log(this.account);
  }
  public async fetchAsync(url: string, body?: any): Promise<any> {
    if (body == null) {
      return await (
        await fetch(`${this.baseUrl}/${url}`, {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        })
      ).json();
    } else {
      return await (
        await fetch(`${this.baseUrl}/${url}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${this.accessToken}` },
        })
      ).json();
    }
  }
}
