// Pokemon names are normalised to lowercase alphanumeric only so they can be
// typed in the single-char input boxes (which only accept letters and digits).
// Sprites are served from the PokeAPI community's GitHub CDN.
const NAMES = [
  'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
  'squirtle', 'wartortle', 'blastoise', 'caterpie', 'metapod', 'butterfree',
  'weedle', 'kakuna', 'beedrill', 'pidgey', 'pidgeotto', 'pidgeot', 'rattata',
  'raticate', 'spearow', 'fearow', 'ekans', 'arbok', 'pikachu', 'raichu',
  'sandshrew', 'sandslash', 'nidoranf', 'nidorina', 'nidoqueen', 'nidoranm',
  'nidorino', 'nidoking', 'clefairy', 'clefable', 'vulpix', 'ninetales',
  'jigglypuff', 'wigglytuff', 'zubat', 'golbat', 'oddish', 'gloom', 'vileplume',
  'paras', 'parasect', 'venonat', 'venomoth', 'diglett', 'dugtrio', 'meowth',
  'persian', 'psyduck', 'golduck', 'mankey', 'primeape', 'growlithe', 'arcanine',
  'poliwag', 'poliwhirl', 'poliwrath', 'abra', 'kadabra', 'alakazam', 'machop',
  'machoke', 'machamp', 'bellsprout', 'weepinbell', 'victreebel', 'tentacool',
  'tentacruel', 'geodude', 'graveler', 'golem', 'ponyta', 'rapidash', 'slowpoke',
  'slowbro', 'magnemite', 'magneton', 'farfetchd', 'doduo', 'dodrio', 'seel',
  'dewgong', 'grimer', 'muk', 'shellder', 'cloyster', 'gastly', 'haunter',
  'gengar', 'onix', 'drowzee', 'hypno', 'krabby', 'kingler', 'voltorb',
  'electrode', 'exeggcute', 'exeggutor', 'cubone', 'marowak', 'hitmonlee',
  'hitmonchan', 'lickitung', 'koffing', 'weezing', 'rhyhorn', 'rhydon', 'chansey',
  'tangela', 'kangaskhan', 'horsea', 'seadra', 'goldeen', 'seaking', 'staryu',
  'starmie', 'mrmime', 'scyther', 'jynx', 'electabuzz', 'magmar', 'pinsir',
  'tauros', 'magikarp', 'gyarados', 'lapras', 'ditto', 'eevee', 'vaporeon',
  'jolteon', 'flareon', 'porygon', 'omanyte', 'omastar', 'kabuto', 'kabutops',
  'aerodactyl', 'snorlax', 'articuno', 'zapdos', 'moltres', 'dratini',
  'dragonair', 'dragonite', 'mewtwo', 'mew',
  'chikorita', 'bayleef', 'meganium', 'cyndaquil', 'quilava', 'typhlosion',
  'totodile', 'croconaw', 'feraligatr', 'sentret', 'furret', 'hoothoot',
  'noctowl', 'ledyba', 'ledian', 'spinarak', 'ariados', 'crobat', 'chinchou',
  'lanturn', 'pichu', 'cleffa', 'igglybuff', 'togepi', 'togetic', 'natu', 'xatu',
  'mareep', 'flaaffy', 'ampharos', 'bellossom', 'marill', 'azumarill',
  'sudowoodo', 'politoed', 'hoppip', 'skiploom', 'jumpluff', 'aipom', 'sunkern',
  'sunflora', 'yanma', 'wooper', 'quagsire', 'espeon', 'umbreon', 'murkrow',
  'slowking', 'misdreavus', 'unown', 'wobbuffet', 'girafarig', 'pineco',
  'forretress', 'dunsparce', 'gligar', 'steelix', 'snubbull', 'granbull',
  'qwilfish', 'scizor', 'shuckle', 'heracross', 'sneasel', 'teddiursa',
  'ursaring', 'slugma', 'magcargo', 'swinub', 'piloswine', 'corsola', 'remoraid',
  'octillery', 'delibird', 'mantine', 'skarmory', 'houndour', 'houndoom',
  'kingdra', 'phanpy', 'donphan', 'porygon2', 'stantler', 'smeargle', 'tyrogue',
  'hitmontop', 'smoochum', 'elekid', 'magby', 'miltank', 'blissey', 'raikou',
  'entei', 'suicune', 'larvitar'
]

export default NAMES.map((name, i) => ({
  id: i + 1,
  name,
  imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`
}))
