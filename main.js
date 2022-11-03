import fs from 'fs';
import dotenv from 'dotenv';

async function getData() {
  const API_KEY = process.env.API_KEY;
  const uri = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=${API_KEY}&regions=us&markets=spreads&oddsFormat=american&bookmakers=draftkings`;
  const response = await fetch(uri);
  
  if (!response.ok) {
    console.error('Request failed');
    return [];
  }
  
  return await response.json();
}

function generatePicks(data) {
  const winnersAndOdds = data.map((gameData) => {
    const winner = gameData.bookmakers[0].markets[0].outcomes.find(x => x.point <= 0);
    return {
      game: `${convertTeamNameToAcronym(gameData.away_team)} @ ${convertTeamNameToAcronym(gameData.home_team)}`,
      winner: convertTeamNameToAcronym(winner.name),
      point: Math.abs(winner.point)
    }
  });

  return winnersAndOdds.sort((a, b) => {
    return b.point - a.point;
  });
}

function convertTeamNameToAcronym(teamName) {
  switch(teamName) {
    case 'Houston Texans':
      return 'HOU';
    case 'Philadelphia Eagles':
      return 'PHI';
    case 'Dallas Cowboys':
      return 'DAL';
    case 'Atlanta Falcons':
      return 'ATL';
    case 'Los Angeles Chargers':
      return 'LAC';
    case 'New York Jets':
      return 'NYJ';
    case 'Buffalo Bills':
      return 'BUF';
    case 'Cincinnati Bengals':
      return 'CIN';
    case 'Carolina Panthers':
      return 'CAR';
    case 'Chicago Bears':
      return 'CHI';
    case 'Miami Dolphins':
      return 'MIA';
    case 'Detroit Lions':
      return 'DET';
    case 'Green Bay Packers':
      return 'GB';
    case 'New England Patriots':
      return 'NE';
    case 'Indianapolis Colts':
      return 'IND';
    case 'Jacksonville Jaguars':
      return 'JAX';
    case 'Las Vegas Raiders':
      return 'LV';
    case 'Washington Commanders':
      return 'WAS';
    case 'Minnesota Vikings':
      return 'MIN';
    case 'Arizona Cardinals':
      return 'ARZ';
    case 'Seattle Seahawks':
      return 'SEA';
    case 'Tampa Bay Buccaneers':
      return 'TB';
    case 'Los Angeles Rams':
      return 'LAR';
    case 'Kansas City Chiefs':
      return 'KC';
    case 'Tennessee Titans':
      return 'TEN';
    case 'New Orleans Saints':
      return 'NO';
    case 'Baltimore Ravens':
      return 'BAL';
    case 'Cleveland Browns':
      return 'CLE';
    case 'Denver Broncos':
      return 'DEN';
    case 'New York Giants':
      return 'NYG';
    case 'Pittsburgh Steelers':
      return 'PIT';
    case 'San Francisco 49ers':
      return 'SF';
    default:
      return teamName;
  }
}

function outputToCSV(picksData) {
  let csv = "Game, Winner, Confidence\n";
  for(let i = 0; i < picksData.length; i++) {
    csv += `"${picksData[i].game}", ${picksData[i].winner}, ${picksData.length - i}`;
    
    if (i < picksData.length - 1) {
      csv += ',\n';
    }
  }
  
  fs.writeFile('picks.csv', csv, err => {
    if (err) {
      console.error(`Error writing picks to file: ${err}`);
    }
  });
}

async function start() {
  const data = await getData();
  
  fs.writeFile('response.json', JSON.stringify(data), err => {
    if (err) {
      console.error(`Error writing JSON to file: ${err}`);
    }
  });

  console.log(`Number of picks: ${data.length}`);

  const picksData = generatePicks(data);
  outputToCSV(picksData);
}

dotenv.config();
start();