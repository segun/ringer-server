import { id, IInstantDatabase, init, InstaQLEntity, InstaQLParams, tx } from "@instantdb/admin";
import schema from "instant.schema";
import * as dotenv from 'dotenv';

dotenv.config();

export type SchemaType = typeof schema;

export type DB = IInstantDatabase<SchemaType>;

export const instaServer = init({
    appId: process.env.INSTANT_APP_ID,
    adminToken: process.env.INSTANT_DB_APP_SECRET,
})

export type User = InstaQLEntity<SchemaType, 'user'>;
export type ChargingStatus = InstaQLEntity<SchemaType, 'chargingStatus'>;

export async function getUserById(id: string): Promise<User | null> {
    const userQueryResponse = await instaServer.query({
        user: {
            $: {
                where: {
                    id
                }
            }
        }
    } as InstaQLParams<SchemaType>);

    if (userQueryResponse && userQueryResponse.user && userQueryResponse.user.length > 0) {
        return userQueryResponse.user[0];
    }
    return null;
}

export async function getUserByEmailOrPhone(emailOrPhone: string): Promise<User | null> {
    const userQueryResponse = await instaServer.query({
        user: {
            $: {
                where: {
                    emailOrPhone
                }
            }
        }
    } as InstaQLParams<SchemaType>);

    if (userQueryResponse && userQueryResponse.user && userQueryResponse.user.length > 0) {
        return userQueryResponse.user[0];
    }
    return null;
}

export async function userExists(emailOrPhone: string): Promise<boolean> {
    const user = await getUserByEmailOrPhone(emailOrPhone);
    return !!user;
}

// insert into user
export async function createUser(user: User) {
    user.id = id();

    await instaServer.transact([
        tx.user[user.id].update(user)
    ]);

    return getUserById(user.id);
}

export async function addChargingStatus(chargingStatus: ChargingStatus) {
    // Query the latest charging status for the user
    const latestStatusResponse = await instaServer.query({
        chargingStatus: {
            $: {
                where: { userId: chargingStatus.userId },
                order: { statusTime: 'desc' },
                limit: 1
            }
        }
    } as InstaQLParams<SchemaType>);
    const latestStatus = latestStatusResponse?.chargingStatus?.[0];

    // If the latest status is the same, do nothing
    if (latestStatus && latestStatus.isPluggedIn === chargingStatus.isPluggedIn) {
        return latestStatus;
    }

    // Insert new charging status
    chargingStatus.id = id();
    await instaServer.transact([
        tx.chargingStatus[chargingStatus.id].update(chargingStatus).link({ user: chargingStatus.userId }),
    ]);

    return chargingStatus;
}

export async function getChargingStatusesByDateRange({ userId, startDate, endDate }: { userId: string, startDate: number, endDate: number }): Promise<ChargingStatus[]> {
    try {
        const chargingStatusQueryResponse = await instaServer.query({
            chargingStatus: {
                $: {
                    where: {
                        and: [
                            {userId: userId},
                            {statusTime: {$gte: startDate}},
                            {statusTime: {$lte: endDate}}
                        ],
                    },
                    order: {
                        statusTime: 'asc'
                    }
                },
                user: {}
            }
        } as InstaQLParams<SchemaType>);

        if (chargingStatusQueryResponse && chargingStatusQueryResponse.chargingStatus && chargingStatusQueryResponse.chargingStatus.length > 0) {
            return chargingStatusQueryResponse.chargingStatus;
        }
    } catch (error) {
        console.log("Error fetching charging statuses by date range", JSON.stringify(error, null, 2));
    }

    return [];
}

export async function getChargingStatusesByLocation({ location, startDate, endDate, userId }: { location: string, startDate: number, endDate: number, userId: string }): Promise<ChargingStatus[]> {
    const whereClause = {
        userLocation: location,
        userId: userId,
        statusTime: {
            $gte: startDate,
            $lte: endDate
        }
    };

    const chargingStatusQueryResponse = await instaServer.query({
        chargingStatus: {
            $: {
                where: whereClause,
                order: {
                    statusTime: 'asc'
                }
            },
            user: {}
        }
    } as InstaQLParams<SchemaType>);

    if (chargingStatusQueryResponse && chargingStatusQueryResponse.chargingStatus && chargingStatusQueryResponse.chargingStatus.length > 0) {
        return chargingStatusQueryResponse.chargingStatus;
    }
    return [];
}