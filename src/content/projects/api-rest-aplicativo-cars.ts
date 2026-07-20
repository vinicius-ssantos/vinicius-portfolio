import type { Lang } from "@/lib/i18n";
import type { ProjectMeta, ProjectText } from "../types";

export const apiRestAplicativoCarsMeta: ProjectMeta = {
  slug: "api-rest-aplicativo-cars",
  name: "api_rest_aplicativo_cars",
  stack: ["Kotlin", "Spring Boot", "Spring Data JPA", "Hibernate", "H2", "Gradle"],
  repoUrl: "https://github.com/vinicius-ssantos/api_rest_aplicativo_cars",
  image: "/projects/api-rest-cars.png",
  updatedAt: "2024-08-10",
  featured: true,
};

const pt: ProjectText = {
  tagline: "API RESTful em Kotlin + Spring Boot para um serviço de transporte",
  description:
    "API RESTful para gerenciar pedidos de viagem de um app de transporte. Motoristas, passageiros e pedidos de viagem modelados como entidades de domínio com separação adequada de pacotes entre domain, interfaces e camadas de mapping.",
  problem:
    "Prover o backend para um app Android nativo em Kotlin que reserva corridas. A API precisava ser direta para o time mobile consumir, com DTOs limpos, mappers e uma camada de domínio que ficasse independente da superfície HTTP.",
  approach: [
    "Layout de pacotes estilo DDD: domain (entidades + serviços), interfaces (controllers + DTOs), mapping (conversores entity ↔ DTO).",
    "Spring Boot + Spring Data JPA em cima de H2 para runs locais zero-config.",
    "Gradle como build tool — Kotlin DSL mantido conciso.",
    "Driver, Passenger e TravelRequest como entidades de domínio first-class; toda interação passa por métodos da service-layer.",
    "Testes unitários + de integração incluídos — `gradle test` roda a suite completa.",
  ],
  role: "Projeto pessoal — autor único",
  highlights: [
    "Separação limpa de domain / interfaces / mapping",
    "Entidades: Driver, Passenger, TravelRequest",
    "Endpoints documentados para o ciclo de vida do pedido de viagem",
    "Licenciado sob MIT, pronto para fork",
  ],
};

const en: ProjectText = {
  tagline: "RESTful API in Kotlin + Spring Boot for a transportation service",
  description:
    "RESTful API to manage travel requests for a transportation app. Drivers, passengers and travel requests modeled as domain entities with proper package separation between domain, interfaces and mapping layers.",
  problem:
    "Provide the backend for a native Android Kotlin app that books rides. The API needed to be straightforward for the mobile team to consume, with clean DTOs, mappers and a domain layer that stays independent of the HTTP surface.",
  approach: [
    "DDD-ish package layout: domain (entities + services), interfaces (controllers + DTOs), mapping (entity ↔ DTO converters).",
    "Spring Boot + Spring Data JPA on top of H2 for zero-config local runs.",
    "Gradle as the build tool — Kotlin DSL kept concise.",
    "Driver, Passenger and TravelRequest as first-class domain entities; every interaction goes through service-layer methods.",
    "Unit + integration tests included — `gradle test` runs the full suite.",
  ],
  role: "Personal project — sole author",
  highlights: [
    "Clean separation of domain / interfaces / mapping",
    "Entities: Driver, Passenger, TravelRequest",
    "Documented endpoints for travel request lifecycle",
    "MIT-licensed, ready to fork",
  ],
};

const text: Record<Lang, ProjectText> = { pt, en };

export function getApiRestAplicativoCars(lang: Lang) {
  return { ...apiRestAplicativoCarsMeta, ...text[lang]! };
}
