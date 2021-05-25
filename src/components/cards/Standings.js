import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import PropTypes from "prop-types";
import { model } from "../../model/model";

import { Table } from "semantic-ui-react";

import CardPlaceholder from "./CardPlaceholder";
import TeamDetail from "../team-detail/TeamDetail";
import { Link } from "react-router-dom";
import { formatTeamName } from "../../others/helper";

const propTypes = { teams: PropTypes.object.isRequired };

// prettier-ignore
const config = { tableHeader: ["#", "Team", "Points", "Played", "W", "D", "L", "GS", "GA", "GD"] };

function Standings({ teams }) {
  const [standingsData, setStandingsData] = useState(null);
  const { leagueName } = useParams();

  useEffect(() => {
    if (!standingsData) getData();

    async function getData() {
      const standings = await model.getStandings(
        leagueName.replaceAll("-", " ")
      );

      setStandingsData(standings);
    }
  }, [standingsData, leagueName]);

  if (!standingsData) return <CardPlaceholder />;

  return (
    <div className="standings">
      <Table celled={true} size="small">
        <Table.Header className="header">
          <Table.Row>
            {config.tableHeader.map((text, i) => (
              <Table.HeaderCell key={i}>{text}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {standingsData?.map((team, i) => (
            <Table.Row key={i}>
              <Table.Cell>{team.position}</Table.Cell>
              <Table.Cell
                className="team-cell"
                width={4}
                children={
                  <Link
                    to={`/team/${teams[team.team_id].leagueName.replaceAll(
                      " ",
                      "-"
                    )}/${formatTeamName(teams[team.team_id].name).replaceAll(
                      " ",
                      "-"
                    )}`}
                  >
                    <TeamDetail {...teams[team.team_id]} />
                  </Link>
                }
              />
              <Table.Cell>{team.points}</Table.Cell>
              <Table.Cell>{team.overall.games_played}</Table.Cell>
              <Table.Cell>{team.overall.won}</Table.Cell>
              <Table.Cell>{team.overall.draw}</Table.Cell>
              <Table.Cell>{team.overall.lost}</Table.Cell>
              <Table.Cell>{team.overall.goals_scored}</Table.Cell>
              <Table.Cell>{team.overall.goals_against}</Table.Cell>
              <Table.Cell>{team.overall.goals_diff}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

Standings.propTypes = propTypes;

export default Standings;
