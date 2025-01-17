/**
 * Commands from the game server to the game client
 * @export
 * @readonly
 * @type {NpsCommandMap[]}
 */

import type { NpsCommandMap } from "mcos-types";

export const NPS_LOBBYSERVER_COMMANDS: NpsCommandMap[] = [
    { name: "NPS_FORCE_LOGOFF", value: 513, module: "Lobby" },
    { name: "NPS_USER_LEFT", value: 514, module: "Lobby" },
    { name: "NPS_USER_JOINED", value: 515, module: "Lobby" },
    { name: "NPS_USER_INFO", value: 516, module: "Lobby" },
    { name: "NPS_SYSTEM_ALERT", value: 517, module: "Lobby" },
    { name: "NPS_CLIENT_COUNT", value: 518, module: "Lobby" },
    { name: "NPS_ACK", value: 519, module: "Lobby" },
    { name: "NPS_USER_LEFT_CHANNEL", value: 520, module: "Lobby" },
    { name: "NPS_CHANNEL_CLOSED", value: 521, module: "Lobby" },
    { name: "NPS_DUP_USER", value: 522, module: "Lobby" },
    { name: "NPS_SERVER_FULL", value: 523, module: "Lobby" },
    { name: "NPS_USER_JOINED_CHANNEL", value: 524, module: "Lobby" },
    { name: "NPS_SERVER_INFO", value: 525, module: "Lobby" },
    { name: "NPS_CHANNEL_CREATED", value: 526, module: "Lobby" },
    { name: "NPS_CHANNEL_DELETED", value: 527, module: "Lobby" },
    { name: "NPS_READY_LIST", value: 528, module: "Lobby" },
    { name: "NPS_USER_LIST", value: 529, module: "Lobby" },
    { name: "NPS_SERVER_LIST", value: 530, module: "Lobby" },
    { name: "NPS_CHANNEL_DENIED", value: 531, module: "Lobby" },
    { name: "NPS_CHANNEL_GRANTED", value: 532, module: "Lobby" },
    { name: "NPS_CHANNEL_CONDITIONAL", value: 533, module: "Lobby" },
    { name: "NPS_SERVER_REDIRECT", value: 534, module: "Lobby" },
    { name: "NPS_HEARTBEAT", value: 535, module: "Lobby" },
    { name: "NPS_HEARTBEAT_TIMEOUT", value: 536, module: "Lobby" },
    { name: "NPS_CHANNEL_UPDATE", value: 537, module: "Lobby" },
    { name: "NPS_FORCE_LEAVE_CHANNEL", value: 538, module: "Lobby" },
    { name: "NPS_USER_LOCATION", value: 539, module: "Lobby" },
    { name: "NPS_GAME_SERVER_STARTED", value: 540, module: "Lobby" },
    { name: "NPS_GAME_SERVER_TERMINATED", value: 541, module: "Lobby" },
    { name: "NPS_VERSIONS_DIFFERENT", value: 542, module: "Lobby" },
    { name: "NPS_SEND_VERSION_STRING", value: 543, module: "Lobby" },
    { name: "NPS_GAME_SKU_REGISTRY_KEY", value: 544, module: "Lobby" },
    { name: "NPS_PLUGIN_ACK", value: 545, module: "Lobby" },
    { name: "NPS_SERVER_CRASHED", value: 546, module: "Lobby" },
    { name: "NPS_OPEN_COMM_CHANNEL_ACK", value: 547, module: "Lobby" },
    { name: "NPS_GAME_SERVER_STATE_CHANGE", value: 548, module: "Lobby" },
    { name: "NPS_SLOT_UPDATE", value: 549, module: "Lobby" },
    { name: "NPS_SLOT_LIST", value: 550, module: "Lobby" },
    { name: "NPS_CHANNEL_MASTER", value: 551, module: "Lobby" },
    { name: "NPS_CHANNEL_MASTER_LIST", value: 552, module: "Lobby" },
    { name: "NPS_MINI_USER_LIST", value: 553, module: "Lobby" },
    { name: "NPS_INVALID_KEY", value: 554, module: "Lobby" },
    { name: "NPS_NO_VALIDATION_SERVER", value: 555, module: "Lobby" },
    { name: "NPS_INC_MINI_USER_LIST", value: 556, module: "Lobby" },
    { name: "NPS_DEC_MINI_USER_LIST", value: 557, module: "Lobby" },
    { name: "NPS_BUDDY_LIST", value: 558, module: "Lobby" },
    { name: "NPS_BUDDYLIST_UPDATE", value: 559, module: "Lobby" },
];
