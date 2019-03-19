import { h, Component } from 'preact';
import { route } from 'preact-router';

import { Calculator } from '../simulator/calculator';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scale: parseInt(this.props.scale),
            population: parseInt(this.props.population),
            density: this.props.density ? parseFloat(this.props.density) + '' : null,
            poverty: this.props.poverty ? parseFloat(this.props.poverty) + '' : null,
            previousBudget: parseInt(this.props.previousBudget),
            displayAutocomplete: true,
            autocompleteCode: '',
            error: null,
        };
    }

    handleIntChange(property, value) {
        value = parseInt(value);
        if (isNaN(value) || value < 0) {
            value = null;
        }

        this.setState({ [property]: value });
    }

    handleInputEnterPressed(event) {
        if (event.keyCode === 13) {
            this.handleButtonClick();
        }
    }

    handleButtonClick() {
        if (!this.state.scale) {
            this.setState({ error: 'L\'échelle territoriale est requise' });
            return;
        }

        if (!this.state.population) {
            this.setState({ error: 'Le nombre d\'habitants est requis' });
            return;
        }

        if (!this.state.density) {
            this.setState({ error: 'La densité de population est requise' });
            return;
        }

        const density = parseFloat(this.state.density.replace(',', '.'));
        if (isNaN(density)) {
            this.setState({ error: 'Cette densité de population est invalide' });
            return;
        }

        if (!this.state.poverty) {
            this.setState({ error: 'Le taux de pauvreté est requis' });
            return;
        }

        const poverty = parseFloat(this.state.poverty.replace(',', '.'));
        if (isNaN(poverty)) {
            this.setState({ error: 'Ce taux de pauvreté est invalide' });
            return;
        }

        if (!this.state.previousBudget) {
            this.setState({ error: 'Le budget alloué en 2019 au pass numérique est requis' });
            return;
        }

        route('/territory/'+[
            this.state.scale,
            this.state.population,
            density,
            poverty,
            this.state.previousBudget,
        ].join('/'));
    }

    render() {
        return (
            <div className="home">
                <h1 className="home__title">
                    Simulation Pass Numériques
                </h1>

                <div className="home__subtitle">
                    Estimation du co-financement de l’Etat
                </div>

                {this.state.error ? <div className="form-error">{this.state.error}</div> : ''}

                <div className="home__field">
                    <select onChange={(e) => this.handleIntChange('scale', e.target.value)}>
                        <option selected={!this.state.scale} disabled>
                            Échelle territoriale du porteur de projet
                        </option>
                        <option selected={this.state.scale === Calculator.SCALE_INTERMUNICIPAL}
                                value={Calculator.SCALE_INTERMUNICIPAL}>
                            Intercommunale
                        </option>
                        <option selected={this.state.scale === Calculator.SCALE_DEPARTMENTAL}
                                value={Calculator.SCALE_DEPARTMENTAL}>
                            Départementale
                        </option>
                        <option selected={this.state.scale === Calculator.SCALE_INTERDEPARTMENTAL}
                                value={Calculator.SCALE_INTERDEPARTMENTAL}>
                            Interdépartementale
                        </option>
                        <option selected={this.state.scale === Calculator.SCALE_REGIONAL}
                                value={Calculator.SCALE_REGIONAL}>
                            Régionale
                        </option>
                    </select>
                </div>

                <div className="home__field">
                    <input type="number"
                           placeholder="Budget pass numérique en 2019 (en €)"
                           value={this.state.previousBudget}
                           onKeyUp={(e) => this.handleInputEnterPressed(e)}
                           onInput={(e) => this.handleIntChange('previousBudget', e.target.value)}
                    />
                </div>

                <br />

                {this.state.displayAutocomplete
                    ? (
                        <div>
                            <div className="home__field">
                                <input type="text"
                                       placeholder="Code INSEE du territoire"
                                       value={this.state.autocompleteCode}
                                       onKeyUp={(e) => this.handleInputEnterPressed(e)}
                                />
                            </div>
                            <button type="button" onClick={() => this.setState({ displayAutocomplete: false })}
                                    className="home__switch-button page__button page__button--link">
                                Ou entrer les informations manuellement
                            </button>
                        </div>
                    )
                    : (
                        <div>
                            <div className="home__field">
                                <input type="number"
                                       placeholder="Nombre d'habitants"
                                       value={this.state.population}
                                       onKeyUp={(e) => this.handleInputEnterPressed(e)}
                                       onInput={(e) => this.handleChange('population', e.target.value)}
                                />
                            </div>

                            <div className="home__field">
                                <input type="number"
                                       placeholder="Densité de population (en hab/km²)"
                                       value={this.state.density}
                                       onKeyUp={(e) => this.handleInputEnterPressed(e)}
                                       onInput={(e) => this.handleChange('density', e.target.value)}
                                />
                            </div>

                            <div className="home__field">
                                <input type="number"
                                       placeholder="Taux de pauvreté en % (INSEE 2015)"
                                       value={this.state.poverty}
                                       onKeyUp={(e) => this.handleInputEnterPressed(e)}
                                       onInput={(e) => this.handleChange('poverty', e.target.value)}
                                />
                            </div>
                            <button type="button" onClick={() => this.setState({ displayAutocomplete: true })}
                                    className="home__switch-button page__button page__button--link">
                                Ou indiquer le code INSEE du territoire
                            </button>
                        </div>
                    )
                }

                <br />

                <div className="home__submit">
                    <button type="button" className="page__button" onClick={() => this.handleButtonClick()}>
                        Continuer
                    </button>
                </div>

                <div className="legalities">
                    Le calcul effectué n’a qu’une valeur indicative pour l’instruction du dossier.
                    Il ne préjuge pas du montant qui sera finalement attribué par l’Agence du Numérique.
                </div>
            </div>
        )
    }
};
