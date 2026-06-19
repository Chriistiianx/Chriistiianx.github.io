const featuredProjects = [
    {
        name: "ToDoPro.Api",
        title: "ToDoPro API",
        type: "API REST",
        visual: "api",
        description: "Backend multiusuario para gestionar tareas con autenticacion JWT, CRUD protegido, filtros por estado y documentacion Swagger.",
        technologies: ["ASP.NET Core", "C#", "EF Core", "PostgreSQL", "JWT"],
        score: 98,
        url: "https://github.com/Chriistiianx/ToDoPro.Api"
    },
    {
        name: "GameHub",
        title: "GameHub Dashboard",
        type: "Web App",
        visual: "web",
        description: "Dashboard en Blazor Server para explorar videojuegos, buscar en tiempo real y consultar detalles usando una API externa.",
        technologies: ["Blazor", ".NET 8", "C#", "API RAWG", "Async"],
        score: 92,
        url: "https://github.com/Chriistiianx/GameHub"
    },
    {
        name: "reactapp-savemoney",
        title: "SaveMoney",
        type: "Mobile App",
        visual: "mobile",
        description: "Aplicacion movil para crear objetivos de ahorro, controlar gastos, clasificar compras y visualizar presupuesto restante.",
        technologies: ["React Native", "Expo", "TypeScript", "Mobile"],
        score: 88,
        url: "https://github.com/Chriistiianx/reactapp-savemoney"
    },
    {
        name: "ProyectoPizzeriaKotlin",
        title: "Pizzeria Kotlin",
        type: "Android UI",
        visual: "kotlin",
        description: "Frontend Kotlin para gestion de pizzeria con navegacion, pantallas de autenticacion, DTOs y ViewModels.",
        technologies: ["Kotlin", "Android", "ViewModel", "DTOs"],
        score: 78,
        url: "https://github.com/Chriistiianx/ProyectoPizzeriaKotlin"
    },
    {
        name: "poobasico",
        title: "POO Basico",
        type: "Fundamentos",
        visual: "java",
        description: "Ejercicio de Java orientado a objetos que muestra fundamentos de clases, encapsulacion y modelado simple.",
        technologies: ["Java", "POO"],
        score: 58,
        url: "https://github.com/Chriistiianx/poobasico"
    }
];

const languageHints = {
    "ToDoPro.Api": ["C#", "ASP.NET Core"],
    "GameHub": ["C#", "Blazor"],
    "reactapp-savemoney": ["TypeScript", "React Native"],
    "ProyectoPizzeriaKotlin": ["Kotlin", "Android"],
    "poobasico": ["Java"]
};

function renderProjects(projects) {
    const grid = document.querySelector("#project-grid");
    if (!grid) return;

    grid.innerHTML = projects
        .sort((a, b) => b.score - a.score)
        .map((project) => {
            const tags = project.technologies
                .slice(0, 5)
                .map((tech) => `<span class="tag">${tech}</span>`)
                .join("");

            return `
                <article class="project-card">
                    <div class="project-visual ${project.visual}" aria-hidden="true">
                        <span class="visual-kicker">${project.type}</span>
                        <h3 class="visual-title">${project.title}</h3>
                    </div>
                    <div class="project-body">
                        <div>
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                        </div>
                        <div class="tag-list" aria-label="Tecnologias de ${project.title}">
                            ${tags}
                        </div>
                    </div>
                    <div class="project-links">
                        <a class="button secondary" href="${project.url}" target="_blank" rel="noopener noreferrer">Ver en GitHub</a>
                    </div>
                </article>
            `;
        })
        .join("");
}

async function hydrateFromGitHub() {
    try {
        const response = await fetch("https://api.github.com/users/Chriistiianx/repos?per_page=100&sort=updated", {
            headers: { Accept: "application/vnd.github+json" }
        });

        if (!response.ok) return;

        const repos = await response.json();
        const repoMap = new Map(repos.map((repo) => [repo.name, repo]));

        const hydrated = featuredProjects.map((project) => {
            const repo = repoMap.get(project.name);
            if (!repo) return project;

            const languageTags = languageHints[project.name] || [];
            const technologies = [...new Set([...project.technologies, repo.language, ...languageTags].filter(Boolean))];

            return {
                ...project,
                url: repo.html_url || project.url,
                technologies,
                score: project.score + Math.min(repo.size || 0, 500) / 1000
            };
        });

        renderProjects(hydrated);
    } catch (error) {
        renderProjects(featuredProjects);
    }
}

renderProjects(featuredProjects);
hydrateFromGitHub();
