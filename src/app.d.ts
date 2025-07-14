import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}

    interface Locals {
      loggedIn: boolean;
      tokenData?: RESTPostOAuth2AccessTokenResult;
    }

    interface PageData {
      loggedIn: boolean;
    }

    // interface PageState {}

    // interface Platform {}
  }
}

export {};
