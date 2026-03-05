import type { CollectionAfterReadHook } from 'payload'
import { User } from 'src/payload-types'
import Database from 'better-sqlite3'
import path from 'path'

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req, req: { payload } }) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    // Raw SQL approach - comment out Payload API
    const dbPath = path.join(process.cwd(), 'cms.db')
    const db = new Database(dbPath, { readonly: true })

    const authorDocs: User[] = []

    for (const author of doc.authors) {
      try {
        // const authorDoc = await payload.findByID({
        //   id: typeof author === 'object' ? author?.id : author,
        //   collection: 'users',
        //   depth: 0,
        // })
        const authorId = typeof author === 'object' ? author?.id : author

        const authorDoc = db.prepare(`
          SELECT id, name, email FROM users
          WHERE id = ?
        `).get(authorId)

        if (authorDoc) {
          authorDocs.push(authorDoc as User)
        }

        if (authorDocs.length > 0) {
          doc.populatedAuthors = authorDocs.map((authorDoc) => ({
            id: authorDoc.id,
            name: authorDoc.name,
          }))
        }
      } catch {
        // swallow error
      }
    }

    db.close()
  }

  return doc
}
