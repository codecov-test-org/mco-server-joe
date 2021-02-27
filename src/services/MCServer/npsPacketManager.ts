// mco-server is a game server, written from scratch, for an old game
// Copyright (C) <2017-2018>  <Joseph W Becher>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Logger } from 'winston'
import { DatabaseManager } from '../../shared/DatabaseManager'
import { IAppSettings, IRawPacket } from '../../types'

import { appSettings } from '../../../config/app-settings'
import { logger } from '../../shared/logger'
import { LoginServer } from './LoginServer/LoginServer'
import { PersonaServer } from './PersonaServer/PersonaServer'
import { LobbyServer } from './LobbyServer/LobbyServer'
import { ConnectionObj } from './ConnectionObj'

/**
 *
 */
export class NPSPacketManager {
  logger: Logger
  config: IAppSettings
  database: DatabaseManager
  npsKey: string
  msgNameMapping: {
    id: number,
    name: string
  }[]

  loginServer: LoginServer
  personaServer: PersonaServer
  lobbyServer: LobbyServer

  /**
   *
   * @param {module:DatabaseManager} databaseMgr
   */
  constructor (databaseMgr: DatabaseManager) {
    this.logger = logger.child({ service: 'mcoserver:NPSPacketManager' })
    this.config = appSettings
    this.database = databaseMgr
    this.npsKey = ''
    this.msgNameMapping = [
      { id: 0x100, name: 'NPS_LOGIN' },
      { id: 0x120, name: 'NPS_LOGIN_RESP' },
      { id: 0x128, name: 'NPS_GET_MINI_USER_LIST' },
      { id: 0x207, name: 'NPS_ACK' },
      { id: 0x217, name: 'NPS_HEATBEAT' },
      { id: 0x229, name: 'NPS_MINI_USER_LIST' },
      { id: 0x30c, name: 'NPS_SEND_MINI_RIFF_LIST' },
      { id: 0x501, name: 'NPS_USER_LOGIN' },
      { id: 0x503, name: 'NPS_REGISTER_GAME_LOGIN' },
      { id: 0x507, name: 'NPS_NEW_GAME_ACCOUNT' },
      { id: 0x532, name: 'NPS_GET_PERSONA_MAPS' },
      { id: 0x607, name: 'NPS_GAME_ACCOUNT_INFO' },
      { id: 0x1101, name: 'NPS_CRYPTO_DES_CBC' }
    ]

    this.loginServer = new LoginServer(this.database)
    this.personaServer = new PersonaServer(
      this.logger.child({ service: 'test_mcoserver:PersonaServer' })
    )
    this.lobbyServer = new LobbyServer()
  }

  /**
   *
   * @param {number} msgId
   * @return {string}
   */
  msgCodetoName (msgId: number): string {
    const mapping = this.msgNameMapping.find(code => {
      return code.id === msgId
    })
    return mapping ? mapping.name : 'Unknown msgId'
  }

  /**
   *
   * @return {string}
   */
  getNPSKey (): string {
    return this.npsKey
  }

  /**
   *
   * @param {string} key
   */
  setNPSKey (key: string):void {
    this.npsKey = key
  }

  /**
   *
   * @param {IRawPacket} rawPacket
   */
  async processNPSPacket (rawPacket: IRawPacket): Promise<ConnectionObj> {
    const msgId = rawPacket.data.readInt16BE(0)
    this.logger.info(
      'Handling message',
      { msgName: this.msgCodetoName(msgId), msgId }
    )

    const { localPort } = rawPacket

    switch (localPort) {
      case 8226:
        return this.loginServer.dataHandler(rawPacket, this.config.serverConfig)
      case 8228:
        return this.personaServer.dataHandler(rawPacket)
      case 7003:
        return this.lobbyServer.dataHandler(rawPacket)
      default:
        this.logger.error(
          '[npsPacketManager] Recieved a packet',
          {
            msgId,
            localPort
          }
        )
        return rawPacket.connection
    }
  }
}