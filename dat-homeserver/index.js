const DatLibrarian = require('dat-librarian')

const dataDirectory = process.env.DATA_DIRECTORY
if (!dataDirectory) {
  throw new Error('DATA_DIRECTORY not set')
}

const archivesString = process.env.ARCHIVES
if (!archivesString) {
  throw new Error('ARCHIVES not set')
}

process.env.log = 'true'

const datId = dat => dat.archive.key.toString('hex')
const subscribeStats = dat => {
  const stats = dat.trackStats()
  setInterval(() => {
    const { network, peers } = stats
    console.log(JSON.stringify({ id: datId(dat), network, peers }))
  }, 5000)
}

async function run() {
  console.log('waiting')
  await new Promise(resolve => setTimeout(resolve, 600000))
  console.log('running')
  const librarian = new DatLibrarian({ dir: dataDirectory })
  librarian.on('add', dat => {
    console.log('add', datId(dat))
    subscribeStats(dat)
  })
  librarian.on('join', dat => console.log('join', datId(dat)))
  librarian.on('remove', dat => console.log('remove', datId(dat)))

  await librarian.load()
  const archives = archivesString.split(',')
  for (const archive of archives) {
    await librarian.add(archive)
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
