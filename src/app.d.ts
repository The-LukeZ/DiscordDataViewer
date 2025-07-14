import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}

    interface Locals {
      loggedIn: boolean;
      sessionId: string | null;
      tokenData?: RESTPostOAuth2AccessTokenResult;
    }

    interface PageData {
      sessionId: string | null;
      loggedIn: boolean;
    }

    // interface PageState {}

    // interface Platform {}
  }

  type LoggedOutReason = "session_expired" | "logout";
}

export {};
