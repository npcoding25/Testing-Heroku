const express = require('express')
const fs = require('fs')
const app = express()

const PORT = process.env.PORT || 3000
const saveFile = './.tableList.json' // save file, it's a hidden file

// will share any static html files with the browser
app.use( express.static('html') )
// accept incoming POST requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Data =======================================================
let tableList = fs.existsSync(saveFile) ?
    JSON.parse( fs.readFileSync(saveFile) ) : []
// let tableList = [ ]

// Routes (Endpoints) =========================================
app.get('/api/tables', function(req, res) {
    res.send( tableList )
})

app.get( '/api/tables/clear', function( req, res ){
    // clear all the table entries
    console.log( 'about to clear all table entries!')
    tableList = []
    fs.writeFileSync( saveFile, JSON.stringify( tableList ) )
    res.send( { message: 'Just nuked all table entries' } )
})

app.post('/api/tables/reserve', function(req, res) {
    const newTableData = req.body
    console.log( `[reservation] tableList(${tableList.length} entries), adding newTableData: \n`, newTableData )
    tableList.push( newTableData )
    // save to a file, as a string like localStorage
    fs.writeFileSync( saveFile, JSON.stringify( tableList ) )

    res.send( { message: `Reserved for *${newTableData.name}*` } )
});

// Listener ==================================================
app.listen(PORT, function() {
    console.log('Serving hot-tables on PORT ' + PORT)
})