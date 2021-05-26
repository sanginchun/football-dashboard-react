import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useNames } from "../../hooks/useNames";

import { model } from "../../model/model";
import { formatTeamName, getTeamURL } from "../../others/helper";

import { Table } from "semantic-ui-react";

import TeamDetail from "../team-detail/TeamDetail";
import CardPlaceholder from "./CardPlaceholder";
import DatePicker from "./date-picker/DatePicker";

const propTypes = {
  subType: PropTypes.string.isRequired,
  teams: PropTypes.object.isRequired,
};

const config = {
  result: { tableHeader: ["Home", "Result", "Away"] },
  upcoming: { tableHeader: ["Home", "Schedule", "Away"] },
};

const getUniqueDates = function (dateArr, subType) {
  const unique = Array.from(new Set(dateArr.map((date) => date.slice(0, 10))));
  if (subType === "result") unique.reverse();

  return unique;
};

function Matches({ subType, teams }) {
  const [matchData, setMatchData] = useState(null);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [date, setDate] = useState(null);
  const { leagueName } = useNames(useParams());

  useEffect(() => {
    let ignore = false;

    getData();

    return () => (ignore = true);

    async function getData() {
      const matches =
        subType === "result"
          ? await model.getMatchResults(leagueName)
          : await model.getMatchUpcoming(leagueName);

      if (!ignore) {
        setMatchData(matches);
        setUniqueDates(
          getUniqueDates(
            matches.map((match) => match.match_start),
            subType
          )
        );
      }
    }
  }, [subType, leagueName]);

  useEffect(() => {
    if (uniqueDates.length) setDate(uniqueDates[0]);
  }, [uniqueDates]);

  if (!matchData) return <CardPlaceholder />;

  if (!matchData.length)
    return <h3 style={{ marginTop: "1rem" }}>No Matches</h3>;

  return (
    <>
      <DatePicker dateArr={uniqueDates} onChange={setDate} />
      <div className="matches">
        <Table celled={true} size="small" textAlign="center">
          <Table.Header className="header">
            <Table.Row>
              {config[subType].tableHeader.map((text, i) => (
                <Table.HeaderCell width={5} key={i}>
                  {text}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {matchData
              .filter((match) => match.match_start.slice(0, 10) === date)
              .map((match, i) => {
                const homeTeam = teams[formatTeamName(match.home_team.name)];
                const awayTeam = teams[formatTeamName(match.away_team.name)];
                const homeScore = match.stats.home_score;
                const awayScore = match.stats.away_score;

                return (
                  <Table.Row key={i}>
                    <Table.Cell
                      className={`team-cell home ${
                        homeScore > awayScore ? "winner" : ""
                      }`}
                      children={
                        <Link to={getTeamURL({ ...homeTeam })}>
                          <TeamDetail {...homeTeam} displayCode={true} />
                        </Link>
                      }
                    />
                    {subType === "result" ? (
                      <Table.Cell
                        className={`score ${
                          homeScore === awayScore ? "winner" : ""
                        }`}
                      >
                        {homeScore} - {awayScore}
                      </Table.Cell>
                    ) : (
                      <Table.Cell width={6} className="schedule">
                        {match.match_start.split(" ")[1]}
                        <br />
                        <small
                          children={`@ ${match.venue?.name || "TBD"}`}
                          style={{ fontSize: "90%" }}
                        />
                      </Table.Cell>
                    )}

                    <Table.Cell
                      className={`team-cell home ${
                        awayScore > homeScore ? "winner" : ""
                      }`}
                      children={
                        <Link to={getTeamURL({ ...awayTeam })}>
                          <TeamDetail {...awayTeam} displayCode={true} />
                        </Link>
                      }
                    />
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}

Matches.propTypes = propTypes;

export default Matches;
