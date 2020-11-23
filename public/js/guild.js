async function updateTables(root){
    const table = root.querySelector('leaderboard_table')
    const response = await fetch(root.data.url)
    const data = await response.json();

    // Clear table
    
    table.querySelector("thead tr").innerHTML = "";
    table.querySelector("tbody").innerHTML = "";

    //Populate Headers
    for(const header of data.headers){
        table.querySelector('thead tr').insertAdjacentHTML("beforeend",`<th>${header}</th>`)
    }

    //Populate rows

    for(const row of data.rows){
        table.querySelector('thead tr').insertAdjacentHTML("beforeend",`
        <tr>
            ${row.map(col=>{`<td>${col}</td>`}).join("")}
        </tr>
        `)

    }

}

