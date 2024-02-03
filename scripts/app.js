    //IDs
    let bgImage = document.getElementById("bgImage");
    let userInput = document.getElementById("userInput");
    let mainImage = document.getElementById("mainImage");
    let dexNumber = document.getElementById("dexNumber");
    let dexName = document.getElementById ("dexName");
    let type1 = document.getElementById("type1");
    let type2 = document.getElementById("type2");
    let locationData = document.getElementById("locationData");
    let abilities = document.getElementById("abilities");
    let moveset = document.getElementById("moveset");
    let bg = document.getElementById("bg");
    let shinyToggle = document.getElementById("shinyToggle");
    let shinyButton = document.getElementById("shinyButton");
    let evolutions = document.getElementById("evolutions");


    //Variables
    var shinySound = new Audio('../audio/shinysound.mp3');
    let pokemonNormal;
    let pokemonShiny;
    let isShiny = false;
    let evoList = [];
    let favoriteList = [];
    let speciesBaseData;
    let evoData;
    


    //functions

    //Capitalizes words
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Function to format terminology
    function formatTerm(term) {
        // Remove dashes and 'main' or 'area' at the end
        let formattedTerm = term.replace(/-/g, ' ').replace(/(main|area)$/i, ' ');

        // Capitalize the first letter of each word
        formattedTerm = formattedTerm.split(' ').map(capitalizeFirstLetter).join(' ');

        return formattedTerm;
    }

    //Calls for primary pokemon data 
    async function PokemonCall(dataPull){
        let dataUse = dataPull;
        const dexPromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${dataUse}/`);
        const dexData = await dexPromise.json();
        return dexData;
    }

    //calls for catch locations for the pokemon
    async function LocationCall(dataPull){
        let dataUse = dataPull;
        const localPromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${dataUse}/encounters`);
        const localData = await localPromise.json();
        return localData;
    }

     //calls for evoloution chains for the pokemon
     async function ChainCall(dataPull){
        let dataUse = dataPull;
        const evoPromise = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${dataUse}/`);
        const evoData = await evoPromise.json();
        const evolutionChainId = evoData.evolution_chain.url.split('/').slice(-2, -1)[0];
        const chainPromise = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}/`);
        const chainData = await chainPromise.json();
        return chainData;
    }


    //Calls Species Data (For evolution process)
    async function SpeciesDataCall(dataPull){
        let dataUse = dataPull;
        const speciesPromise = await fetch(speciesBaseData);
        const speciesData = await speciesPromise.json();
        return speciesData;
    }

     //Calls Species Data (For evolution process)
     async function EvolutionDataCall(dataPull){
        let dataUse = dataPull;
        const speciesPromise = await fetch(speciesData);
        const speciesData = await speciesPromise.json();
        return speciesData;
    }




    // console.log(PokemonCall(""));

    let dataArray = [];

    const MainImageToggle = async () => {
        shinyButton.classList.remove('bg-yellow-500');
        shinyButton.classList.add('bg-slate-400');
        isShiny = false;
        
        shinyToggle.addEventListener('click', async function (event) {

                
        if (isShiny) {
            mainImage.src = pokemonNormal;
            shinyButton.classList.toggle('bg-yellow-500');
            shinyButton.classList.toggle('bg-slate-400');
        }else{
            mainImage.src = pokemonShiny;
            shinyButton.classList.toggle('bg-slate-400');
            shinyButton.classList.toggle('bg-yellow-500');
            shinySound.play();
        }

            isShiny = !isShiny;

                 
        });
    }

    
    // const displayEvolutionChain = async (dataPull) => {
        
    //     dataPull.chain.evolves_to.forEach(element, index {
    //         evoList += formatTerm(element);

    //         // Check if it's not the last element before adding a comma
    //         if (index < returnData.abilities.length - 1) {
    //             abilitiesList += ", \n";
    //         }
    //     });
        
        

    // }


    


    const PokemonData = async () => {
        userInput.addEventListener('keydown', async function(event) {
            if (event.key === "Enter") {
                const returnData = await PokemonCall(userInput.value.toLowerCase());
                
                const localData = await LocationCall(userInput.value.toLowerCase());

                const chainData = await ChainCall(userInput.value.toLowerCase());

                // displayEvolutionChain(chainData, userInput.value.toLowerCase());
                
                userInput.value = '';

                console.clear();

                console.log(returnData);

                console.log(localData);

                console.log(chainData);

                //pulls normal version of pokemon
                pokemonNormal = returnData.sprites.other.home.front_default;
                //pulls shiny version of pokemon to store for later
                pokemonShiny = returnData.sprites.other.home.front_shiny;
                //displays normal version of pokemon
                mainImage.src = returnData.sprites.other.home.front_default;    

                MainImageToggle();
                
                //Display Pokedex Number and Name
                const paddedId = String(returnData.id).padStart(3, '0');

                dexNumber.textContent = "NO." + paddedId;

                dexName.textContent = capitalizeFirstLetter(returnData.name);

                //Pokemon Type
                type1.textContent = capitalizeFirstLetter(returnData.types[0].type.name);
                

                if (returnData.types.length === 1){
                    type2.textContent = 'N/A';
                }else{
                    type2.textContent = capitalizeFirstLetter(returnData.types[1].type.name);
                }
                

                //Abilities
                let abilitiesList = "Abilities: ";

                
                returnData.abilities.forEach(function(element, index) {
                    abilitiesList +=  formatTerm(element.ability.name);

                    // Check if it's not the last element before adding a comma
                    if (index < returnData.abilities.length - 1) {
                        abilitiesList += ", \n";
                    }
                });

                abilities.textContent = "\n" + abilitiesList;


                //Locations
                let locationList = "Can be found in: \n";

                localData.forEach(function (element, index) {
                    locationList += formatTerm(element.location_area.name);

                    if (index < localData.length - 1) {
                        locationList += ", \n";
                    }
                });

                if (localData.length === 0) {
                    locationData.textContent = "Can be found in: N/A";
                } else {
                    locationData.textContent = "\n" + locationList;
                }
                

                //Moveset
                let moveList = "Move Data: ";

                returnData.moves.forEach(function(element, index) {
                    moveList += formatTerm(element.move.name);

                    // Check if it's not the last element before adding a comma
                    if (index < returnData.moves.length - 1) {
                        moveList += ", \n";
                    }
                });

                moveset.textContent = "\n" + moveList;

                //Evolution Chain
                let evoList = '';

                speciesBaseData = chainData.chain.species.url;
                
                const speciesPull = SpeciesDataCall();

               

                // displayEvolutionChain(chainData);
                
            }
        });
    }

    

  
    PokemonData();
    
    

