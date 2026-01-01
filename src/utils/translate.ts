export type Language = 'en' | 'it';

const content = {
    en: {
        title: "NablaVis",
        gradient: "Gradient Theorem",
        curl: "Stokes' Theorem (Curl)",
        divergence: "Divergence Theorem",
        nav_gradient: "Gradient",
        nav_curl: "Curl",
        nav_divergence: "Divergence",
        desc_gradient: "The integral of a gradient field along a curve depends only on endpoints.",
        desc_curl: "The circulation of a vector field along a closed loop equals the flux of its curl through the surface.",
        desc_divergence: "The flux of a vector field through a closed surface equals the integral of its divergence over the volume.",
        toggle_lang: "Pass lang=it in URL to switch or click:",
        select_field: "Select Field:",
        click_to_move: "Click anywhere to move nearest point",
        field_rotation: "Simple Rotation",
        field_saddle: "Saddle (Irrotational)",
        field_shear: "Shear Flow",
        field_spiral: "Expanding Spiral",
        field_hill: "Hill & Valley",
        field_paraboloid: "Paraboloid",
        field_saddle_surface: "Saddle Surface",
        field_gaussian: "Gaussian Peak",
        field_source: "Source",
        field_sink: "Sink",
        field_uniform: "Uniform Field",
        field_vertical: "Vertical Expansion"
    },
    it: {
        title: "NablaVis",
        gradient: "Teorema del Gradiente",
        curl: "Teorema del Rotore",
        divergence: "Teorema della Divergenza",
        nav_gradient: "Gradiente",
        nav_curl: "Rotore",
        nav_divergence: "Divergenza",
        desc_gradient: "L'integrale di un campo gradiente lungo una curva dipende solo dagli estremi.",
        desc_curl: "La circuitazione di un campo vettoriale lungo una linea chiusa è uguale al flusso del rotore attraverso la superficie.",
        desc_divergence: "Il flusso di un campo vettoriale attraverso una superficie chiusa è uguale all'integrale della divergenza sul volume.",
        toggle_lang: "Passa lang=it nell'URL per cambiare o clicca:",
        select_field: "Seleziona Campo:",
        click_to_move: "Clicca ovunque per muovere il punto più vicino",
        field_rotation: "Rotazione Semplice",
        field_saddle: "Sella (Irrotazionale)",
        field_shear: "Flusso di Taglio",
        field_spiral: "Spirale in Espansione",
        field_hill: "Picco e Valle",
        field_paraboloid: "Paraboloide",
        field_saddle_surface: "Superficie a Sella",
        field_gaussian: "Picco Gaussiano",
        field_source: "Sorgente",
        field_sink: "Pozzo",
        field_uniform: "Campo Uniforme",
        field_vertical: "Espansione Verticale"
    }
};

export const getLang = (): Language => {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') === 'it' ? 'it' : 'en';
};

export const useTranslation = () => {
    const lang = getLang();
    return content[lang];
};
