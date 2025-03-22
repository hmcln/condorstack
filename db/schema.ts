import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable('users', {
    id: text().$defaultFn(() => createId()).primaryKey(),
    providerId: text('provider_id'),
    email: text('email'),
    fullName: text('fullName'),
    pictureUrl: text('picture_url'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    labels: text('labels'),
});

