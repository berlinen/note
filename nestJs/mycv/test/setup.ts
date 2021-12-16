import { promises } from 'fs'
import { join } from 'path'
import { getConnection  } from 'typeorm'

const { rm } = promises

global.beforeEach(async() => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'))
  } catch(err) {}
})

global.afterEach(async() => {
  const conn = await getConnection()
  await conn.close()
})