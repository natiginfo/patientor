import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Icon } from "semantic-ui-react";
import HealthRatingBar from "../components/HealthRatingBar";
import { apiBaseUrl } from "../constants";
import { getPatientDetails, useStateValue } from "../state";
import { Entry, Patient } from "../types";

const HealthCheckEntry: React.FC<{ entry: Entry }> = ({ entry }) => {
  const HealthBar = () => entry.type === "HealthCheck" ? <Card.Content extra>
    <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
  </Card.Content> : null;

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          {entry.date} <Icon color="orange" name="stethoscope" />
        </Card.Header>
        <Card.Meta>by {entry.specialist}</Card.Meta>
        <Card.Description>{entry.description}</Card.Description>
        <ul>
          {entry.diagnosisCodes?.map(diagnosysCode => <li key={diagnosysCode}>{diagnosysCode}</li>)}
        </ul>
      </Card.Content>
      <HealthBar />
    </Card>
  );
};


const genderIconProps = {
  male: { name: "mars" as "mars", color: "blue" as "blue" },
  female: { name: "venus" as "venus", color: "pink" as "pink" },
  other: { name: "genderless" as "genderless", color: "grey" as "grey" },
};

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

  const patient = patients[id];

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(getPatientDetails(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient();
  }, [dispatch, id]);

  if (patient && patient.entries) {
    return (
      <div className="App">
        <Container textAlign="center">
          <h3>Patient Details</h3>
        </Container>
        <h4>{patient.name} <Icon {...genderIconProps[patient.gender]} /></h4>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        {patient.entries.length > 0 ? <h4>entries</h4> : null}
        {patient.entries.map((entry) => (
          <div key={entry.id}>
            <p key={entry.id}>{entry.date} {entry.description}</p>
            <HealthCheckEntry entry={entry} />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="App">
        <Container textAlign="center">
          <h3>Patient Details Loading</h3>
        </Container>
      </div>
    );
  }
};

export default PatientDetailsPage;
