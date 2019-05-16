import React from "react";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

let interval = null;

type BluescreenState = {
  isNameModalVisible: boolean;
  now: number;
  isLoadingData: boolean;
  data: Array<any>;
};

export default class Bluescreen extends React.Component<{}, BluescreenState> {
  constructor(props) {
    super(props);
    this.state = {
      isNameModalVisible: false,
      now: Date.now(),
      isLoadingData: false,
      data: [{ name: "Vitor Gomes", date: moment(Date.now()).format() }, { name: "Vitor Gomes", date: moment(Date.now()).format() }]
    };
  }

  calculateDateDiff(lastDate: Date) {
    var b = moment([2019, 4, 14, 21, 5, 0]);
    var duration = moment.duration(moment(this.state.now).diff(b));
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

  componentDidMount() {
    interval = setInterval(() => this.setState({ now: Date.now() }), 1000);
  }
  componentWillUnmount() {
    clearInterval(interval);
  }

  toggleNameModal = () => {
    this.setState({ isNameModalVisible: !this.state.isNameModalVisible });
  };

  addIncident = () => {
    this.toggleNameModal();
    // TODO;
    toast.success("Sua ocorrência foi salva!");
  };

  renderModal() {
    return (
      <div
        className={this.state.isNameModalVisible ? "modal is-active" : "modal"}
      >
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Qual seu nome?</p>
            <button
              className="delete"
              aria-label="close"
              onClick={this.toggleNameModal}
            />
          </header>
          <section className="modal-card-body">
            <input className="input" type="text" />
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
                <th>Nome</th>
                <th>Data</th>
              </thead>
              <tbody>
                {this.state.data.map(elem => {
                  return (
                    <tr>
                      <td>{elem.name}</td>
                      <td>{elem.date}</td>
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
    return (
      <div className="App">
        {this.renderModal()}
        <section className="hero is-fullheight is-info is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-size-1">
                {this.calculateDateDiff(null)}
              </h1>
              <h2 className="subtitle is-size-1">Sem tela azul</h2>
              <br />
              {this.state.data.length > 0 && this.renderTable()}
              {this.state.data.length === 0 && (
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
