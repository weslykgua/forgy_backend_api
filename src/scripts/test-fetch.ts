async function testFetch() {
  try {
    const res1 = await fetch('https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json')
    const data1: any = await res1.json()
    console.log('hasaneyldrm/exercises-dataset count:', data1.length)
    console.log('hasaneyldrm/exercises-dataset example:', JSON.stringify(data1[0], null, 2))

    const res2 = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json')
    const data2: any = await res2.json()
    console.log('yuhonas/free-exercise-db count:', data2.length)
    console.log('yuhonas/free-exercise-db example:', JSON.stringify(data2[0], null, 2))
  } catch (err: any) {
    console.error('Error fetching datasets:', err.message)
  }
}

testFetch()
