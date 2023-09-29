/* eslint-disable import/no-cycle */

import { flow, Instance, SnapshotOrInstance, types } from "mobx-state-tree"
import { getUniqueId } from "../../common/state/uid"
import {
  BRANDED_DEFAULT_AVATAR_URL,
  DEFAULT_AVATAR_URL,
  DEFAULT_DISPLAY_NAME,
  DISCORD_API_HOST_PROMISE,
  DISCORD_AVATARS_CDN_BASE_URL,
  MESSAGE_REF_RE,
} from "./constants"
import type { WebhookData } from "./WebhookData"

export const WebhookModel = types
  .model("WebhookModel", {
    id: types.optional(types.identifierNumber, getUniqueId),
    url: "",
  })
  .volatile(() => ({
    exists: undefined as boolean | undefined,
    snowflake: undefined as string | undefined,
    name: undefined as string | undefined,
    avatar: undefined as string | null | undefined,
    channelId: undefined as string | undefined,
    guildId: undefined as string | undefined,
    token: undefined as string | undefined,
  }))
  .views(self => ({
    get avatarUrl() {
      if (!self.avatar) return self.avatar
      return `${DISCORD_AVATARS_CDN_BASE_URL}/${self.snowflake}/${self.avatar}.png`
    },

    get displayName() {
      return self.name ?? DEFAULT_DISPLAY_NAME
    },

    get displayAvatarUrl() {
      return (
        this.avatarUrl ??
        (self.avatar === null ? DEFAULT_AVATAR_URL : BRANDED_DEFAULT_AVATAR_URL)
      )
    },

    async getRoute(reference?: string) {
      const host = await DISCORD_API_HOST_PROMISE

      const match = reference && MESSAGE_REF_RE.exec(reference)

      const threadParam = new URL(self.url).searchParams.get("thread_id")

      if (match) {
        const [, messageId] = match

        const routeUrl = new URL(
          `https://${host}/api/v10/webhooks/${self.snowflake}/${self.token}/messages/${messageId}`,
        )
        if (threadParam) {
          routeUrl.searchParams.set("thread_id", threadParam)
        }

        return ["PATCH", String(routeUrl)]
      }

      const routeUrl = new URL(
        `https://${host}/api/v10/webhooks/${self.snowflake}/${self.token}?wait=true`,
      )
      if (threadParam) {
        routeUrl.searchParams.set("thread_id", threadParam)
      }

      return ["POST", String(routeUrl)]
    },
  }))
  .actions(self => ({
    set<K extends keyof typeof self>(
      key: K,
      value: SnapshotOrInstance<typeof self[K]>,
    ) {
      self[key] = value
    },

    fetch: flow(function* () {
      self.exists = undefined
      self.snowflake = undefined
      self.name = undefined
      self.avatar = undefined
      self.channelId = undefined
      self.guildId = undefined
      self.token = undefined

      try {
        const url = new URL(self.url)
        url.host = yield DISCORD_API_HOST_PROMISE

        const response: Response = yield fetch(String(url))

        /* eslint-disable require-atomic-updates */

        if (!response.ok) {
          self.exists = false
          return
        }

        const webhook: WebhookData = yield response.json()

        self.exists = true
        self.snowflake = webhook.id
        self.name = webhook.name
        self.avatar = webhook.avatar
        self.channelId = webhook.channel_id
        self.guildId = webhook.guild_id
        self.token = webhook.token

        /* eslint-enable require-atomic-updates */
      } catch {
        // do nothing
      }
    }),
  }))

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface WebhookLike extends Instance<typeof WebhookModel> {}
