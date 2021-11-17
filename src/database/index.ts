// @ts-check
// mcos is a game server, written from scratch, for an old game
// Copyright (C) <2017-2021>  <Drazi Crendraven>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import * as sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { IDatabaseManager, SessionRecord } from "../types/index";
import P from "pino";
import { AppConfiguration, ConfigurationManager } from "../config/index";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { EServerConnectionName, RoutingMesh } from "../router/index";

const log = P().child({ service: "mcoserver:DatabaseMgr" });
log.level = process.env["LOG_LEVEL"] || "info";

export class DatabaseManager implements IDatabaseManager {
  static _instance: DatabaseManager;
  _config: AppConfiguration;
  _server: Server;
  changes = 0;
  localDB!: Database;

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager._instance) {
      DatabaseManager._instance = new DatabaseManager();
    }

    const self = DatabaseManager._instance;

    open({ filename: "mco.db", driver: sqlite3.Database })
      .then(async (db) => {
        self.localDB = db;

        self.changes = 0;

        await db.run(`CREATE TABLE IF NOT EXISTS "sessions"
          (
            customer_id integer,
            sessionkey text NOT NULL,
            skey text NOT NULL,
            context_id text NOT NULL,
            connection_id text NOT NULL,
            CONSTRAINT pk_session PRIMARY KEY(customer_id)
          );`);

        await db.run(`CREATE TABLE IF NOT EXISTS "lobbies"
          (
            "lobyID" integer NOT NULL,
            "raceTypeID" integer NOT NULL,
            "turfID" integer NOT NULL,
            "riffName" character(32) NOT NULL,
            "eTerfName" character(265) NOT NULL,
            "clientArt" character(11) NOT NULL,
            "elementID" integer NOT NULL,
            "terfLength" integer NOT NULL,
            "startSlice" integer NOT NULL,
            "endSlice" integer NOT NULL,
            "dragStageLeft" integer NOT NULL,
            "dragStageRight" integer NOT NULL,
            "dragStagingSlice" integer NOT NULL,
            "gridSpreadFactor" real NOT NULL,
            "linear" smallint NOT NULL,
            "numPlayersMin" smallint NOT NULL,
            "numPlayersMax" smallint NOT NULL,
            "numPlayersDefault" smallint NOT NULL,
            "bnumPlayersEnable" smallint NOT NULL,
            "numLapsMin" smallint NOT NULL,
            "numLapsMax" smallint NOT NULL,
            "numLapsDefault" smallint NOT NULL,
            "bnumLapsEnabled" smallint NOT NULL,
            "numRoundsMin" smallint NOT NULL,
            "numRoundsMax" smallint NOT NULL,
            "numRoundsDefault" smallint NOT NULL,
            "bnumRoundsEnabled" smallint NOT NULL,
            "bWeatherDefault" smallint NOT NULL,
            "bWeatherEnabled" smallint NOT NULL,
            "bNightDefault" smallint NOT NULL,
            "bNightEnabled" smallint NOT NULL,
            "bBackwardDefault" smallint NOT NULL,
            "bBackwardEnabled" smallint NOT NULL,
            "bTrafficDefault" smallint NOT NULL,
            "bTrafficEnabled" smallint NOT NULL,
            "bDamageDefault" smallint NOT NULL,
            "bDamageEnabled" smallint NOT NULL,
            "bAIDefault" smallint NOT NULL,
            "bAIEnabled" smallint NOT NULL,
            "topDog" character(13) NOT NULL,
            "terfOwner" character(33) NOT NULL,
            "qualifingTime" integer NOT NULL,
            "clubNumPlayers" integer NOT NULL,
            "clubNumLaps" integer NOT NULL,
            "clubNumRounds" integer NOT NULL,
            "bClubNight" smallint NOT NULL,
            "bClubWeather" smallint NOT NULL,
            "bClubBackwards" smallint NOT NULL,
            "topSeedsMP" integer NOT NULL,
            "lobbyDifficulty" integer NOT NULL,
            "ttPointForQualify" integer NOT NULL,
            "ttCashForQualify" integer NOT NULL,
            "ttPointBonusFasterIncs" integer NOT NULL,
            "ttCashBonusFasterIncs" integer NOT NULL,
            "ttTimeIncrements" integer NOT NULL,
            "victoryPoints1" integer NOT NULL,
            "victoryCash1" integer NOT NULL,
            "victoryPoints2" integer NOT NULL,
            "victoryCash2" integer NOT NULL,
            "victoryPoints3" integer NOT NULL,
            "victoryCash3" integer NOT NULL,
            "minLevel" smallint NOT NULL,
            "minResetSlice" integer NOT NULL,
            "maxResetSlice" integer NOT NULL,
            "bnewbieFlag" smallint NOT NULL,
            "bdriverHelmetFlag" smallint NOT NULL,
            "clubNumPlayersMax" smallint NOT NULL,
            "clubNumPlayersMin" smallint NOT NULL,
            "clubNumPlayersDefault" smallint NOT NULL,
            "numClubsMax" smallint NOT NULL,
            "numClubsMin" smallint NOT NULL,
            "racePointsFactor" real NOT NULL,
            "bodyClassMax" smallint NOT NULL,
            "powerClassMax" smallint NOT NULL,
            "clubLogoID" integer NOT NULL,
            "teamtWeather" smallint NOT NULL,
            "teamtNight" smallint NOT NULL,
            "teamtBackwards" smallint NOT NULL,
            "teamtNumLaps" smallint NOT NULL,
            "raceCashFactor" real NOT NULL
          );`);
      })
      .catch((err) => {
        if (err instanceof Error) {
          const newError = new Error(
            `There was an error setting up the database: ${err.message}`
          );
          log.error(newError.message);
          throw newError;
        }
        throw err;
      });

    return DatabaseManager._instance;
  }

  private constructor() {
    this._config = ConfigurationManager.getInstance().getConfig();

    this._server = createServer((request, response) => {
      this.handleRequest(request, response);
    });

    this._server.on("error", (error) => {
      process.exitCode = -1;
      log.error(`Server error: ${error.message}`);
      log.info(`Server shutdown: ${process.exitCode}`);
      process.exit();
    });
  }

  handleRequest(request: IncomingMessage, response: ServerResponse): void {
    const header = {
      type: "Content-Type",
      value: "application/json",
    };

    switch (request.url) {
      case "/":
        response.setHeader(header.type, header.value);
        response.end(
          JSON.stringify({
            status: 200,
            message: "Hello",
          })
        );
        break;

      default:
        response.statusCode = 404;
        response.end("");
        break;
    }
  }

  async fetchSessionKeyByCustomerId(
    customerId: number
  ): Promise<SessionRecord> {
    if (!this.localDB) {
      throw new Error("Error accessing database. Are you using the instance?");
    }
    const stmt = await this.localDB.prepare(
      "SELECT sessionkey, skey FROM sessions WHERE customer_id = ?"
    );

    const record = await stmt.get(customerId);
    if (record === undefined) {
      throw new Error("Unable to fetch session key");
    }
    return record as SessionRecord;
  }

  async fetchSessionKeyByConnectionId(
    connectionId: string
  ): Promise<SessionRecord> {
    if (!this.localDB) {
      throw new Error("Error accessing database. Are you using the instance?");
    }
    const stmt = await this.localDB.prepare(
      "SELECT sessionkey, skey FROM sessions WHERE connection_id = ?"
    );
    const record = await stmt.get(connectionId);
    if (record === undefined) {
      throw new Error("Unable to fetch session key");
    }
    return record as SessionRecord;
  }

  async _updateSessionKey(
    customerId: number,
    sessionkey: string,
    contextId: string,
    connectionId: string
  ): Promise<number> {
    const skey = sessionkey.slice(0, 16);

    if (!this.localDB) {
      throw new Error("Error accessing database. Are you using the instance?");
    }
    const stmt = await this.localDB.prepare(
      "REPLACE INTO sessions (customer_id, sessionkey, skey, context_id, connection_id) VALUES ($customerId, $sessionkey, $skey, $contextId, $connectionId)"
    );
    const record = await stmt.run({
      $customerId: customerId,
      $sessionkey: sessionkey,
      $skey: skey,
      $contextId: contextId,
      $connectionId: connectionId,
    });
    if (record === undefined) {
      throw new Error("Unable to fetch session key");
    }
    return 1;
  }

  start(): Server {
    const host = this._config.serverSettings.ipServer || "localhost";
    const port = 0;
    log.debug(`Attempting to bind to port ${port}`);
    return this._server.listen({ port, host }, () => {
      log.debug(`port ${port} listening`);
      log.info("Patch server is listening...");

      // Register service with router
      RoutingMesh.getInstance().registerServiceWithRouter(
        EServerConnectionName.DATABASE,
        host,
        port
      );
    });
  }
}