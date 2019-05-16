import React from "react";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import axios from "axios";
import DatePicker from "react-datepicker";

let interval = null;

const API = 'https://backend-dot-bluescreen.appspot.com/incidents';

type BluescreenState = {
  isNameModalVisible: boolean;
  now: number;
  isLoadingData: boolean;
  data: Array<any>;
  incidentDate: Date;
  name: string;
};

export default class Bluescreen extends React.Component<{}, BluescreenState> {
  constructor(props) {
    super(props);
    this.state = {
      isNameModalVisible: false,
      now: Date.now(),
      isLoadingData: true,
      data: [],
      incidentDate: new Date(),
      name: ""
    };
  }

  calculateDateDiff() {
    let latest;
    if (this.state.data.length > 0) {
      latest = moment(this.state.data[0].date);
    } else {
      latest = Date.now();
    }
    var duration = moment.duration(moment(this.state.now).diff(latest));
    return (
      duration.get("days") +
      " dia(s) " +
      duration.get("hours") +
      " hora(s) " +
      duration.get("minutes") +
      " minuto(s) " +
      duration.get("seconds") +
      " segundo(s)"
    );
  }

  async componentDidMount() {
    interval = setInterval(() => this.setState({ now: Date.now() }), 1000);
    this.fetchData();
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  toggleNameModal = () => {
    this.setState({ isNameModalVisible: !this.state.isNameModalVisible });
  };

  addIncident = async () => {
    this.toggleNameModal();
    await axios.post(API, {
      name: this.state.name,
      date: this.state.incidentDate
    });
    toast.success("Sua ocorrência foi salva!");
    this.setState({ name: "", incidentDate: new Date() }, () =>
      this.fetchData()
    );
  };

  handleDateChange = date => {
    this.setState({ incidentDate: date });
  };

  handleNameChange = evt => {
    this.setState({ name: evt.target.value });
  };

  fetchData = async () => {
    this.setState({ isLoadingData: true }, async () => {
      const response = await axios.get(API);
      this.setState({ isLoadingData: false, data: response.data });
    });
  };

  renderModal() {
    return (
      <div
        className={this.state.isNameModalVisible ? "modal is-active" : "modal"}
      >
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Registrar Tela Azul</p>
            <button
              className="delete"
              aria-label="close"
              onClick={this.toggleNameModal}
            />
          </header>
          <section className="modal-card-body">
            <div className="columns">
              <div className="column is-two-thirds">
                <label className="label is-pulled-left">Nome:</label>
                <input
                  id="name"
                  className="input"
                  type="text"
                  onChange={this.handleNameChange}
                />
              </div>
              <div className="column">
                <label className="label is-pulled-left">Data:</label>
                <div className="control">
                  <DatePicker
                    className="input"
                    selected={this.state.incidentDate}
                    onChange={this.handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeIntervals={15}
                  />
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.addIncident}>
              Salvar
            </button>
            <button className="button" onClick={this.toggleNameModal}>
              Cancelar
            </button>
          </footer>
        </div>
      </div>
    );
  }

  renderTable = () => {
    return (
      <LoadingOverlay
        active={this.state.isLoadingData}
        spinner
        text="Carregando..."
      >
        <h1 className="title">Últimas Ocorrências</h1>
        <div className="columns is-centered">
          <div className="column is-half">
            <table className="table is-fullwidth is-bordered incidents-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map(elem => {
                  return (
                    <tr key={elem.id}>
                      <td>{elem.name}</td>
                      <td>{moment(elem.date, "YYYY-MM-DDThh:mm:ssZ").format("YYYY-MM-DD HH:mm:ss")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </LoadingOverlay>
    );
  };

  render() {
    let latest = this.state.data.length > 0 ? Date.now() : Date.now();
    return (
      <div className="App">
        {this.renderModal()}
        <section className="hero is-fullheight is-info is-bold">
          <div className="hero-body">
            <div className="container">
              {this.state.data.length > 0 && (
                <h1 className="title is-size-1">{this.calculateDateDiff()}</h1>
              )}
              <h2 className="subtitle is-size-1">Sem tela azul</h2>
              <br />
              {(this.state.data.length > 0 || this.state.isLoadingData) &&
                this.renderTable()}
              {this.state.data.length === 0 && !this.state.isLoadingData && (
                <p className="is-size-5">Nenhum incidente por enquanto!</p>
              )}
              <br />
              <button
                className="button is-danger"
                onClick={this.toggleNameModal}
              >
                Eu tive uma tela azul :(
              </button>
            </div>
          </div>
        </section>
        <ToastContainer />
      </div>
    );
  }
}
