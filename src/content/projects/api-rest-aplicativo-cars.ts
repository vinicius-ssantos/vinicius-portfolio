import type { Project } from "../types";

export const apiRestAplicativoCars: Project = {
  slug: "api-rest-aplicativo-cars",
  name: "api_rest_aplicativo_cars",
  tagline: {
    pt: "API RESTful em Kotlin + Spring Boot para um serviço de transporte",
    en: "RESTful API in Kotlin + Spring Boot for a transportation service",
  },
  description: {
    pt: "API RESTful para gerenciar pedidos de viagem de um app de transporte. Motoristas, passageiros e pedidos de viagem modelados como entidades de domínio com separação adequada de pacotes entre domain, interfaces e camadas de mapping.",
    en: "RESTful API to manage travel requests for a transportation app. Drivers, passengers and travel requests modeled as domain entities with proper package separation between domain, interfaces and mapping layers.",
  },
  problem: {
    pt: "Prover o backend para um app Android nativo em Kotlin que reserva corridas. A API precisava ser direta para o time mobile consumir, com DTOs limpos, mappers e uma camada de domínio que ficasse independente da superfície HTTP.",
    en: "Provide the backend for a native Android Kotlin app that books rides. The API needed to be straightforward for the mobile team to consume, with clean DTOs, mappers and a domain layer that stays independent of the HTTP surface.",
  },
  approach: [
    {
      pt: "Layout de pacotes estilo DDD: domain (entidades + serviços), interfaces (controllers + DTOs), mapping (conversores entity ↔ DTO).",
      en: "DDD-ish package layout: domain (entities + services), interfaces (controllers + DTOs), mapping (entity ↔ DTO converters).",
    },
    {
      pt: "Spring Boot + Spring Data JPA em cima de H2 para runs locais zero-config.",
      en: "Spring Boot + Spring Data JPA on top of H2 for zero-config local runs.",
    },
    {
      pt: "Gradle como build tool — Kotlin DSL mantido conciso.",
      en: "Gradle as the build tool — Kotlin DSL kept concise.",
    },
    {
      pt: "Driver, Passenger e TravelRequest como entidades de domínio first-class; toda interação passa por métodos da service-layer.",
      en: "Driver, Passenger and TravelRequest as first-class domain entities; every interaction goes through service-layer methods.",
    },
    {
      pt: "Testes unitários + de integração incluídos — `gradle test` roda a suite completa.",
      en: "Unit + integration tests included — `gradle test` runs the full suite.",
    },
  ],
  stack: ["Kotlin", "Spring Boot", "Spring Data JPA", "Hibernate", "H2", "Gradle"],
  role: {
    pt: "Projeto pessoal — autor único",
    en: "Personal project — sole author",
  },
  highlights: [
    {
      pt: "Separação limpa de domain / interfaces / mapping",
      en: "Clean separation of domain / interfaces / mapping",
    },
    {
      pt: "Entidades: Driver, Passenger, TravelRequest",
      en: "Entities: Driver, Passenger, TravelRequest",
    },
    {
      pt: "Endpoints documentados para o ciclo de vida do pedido de viagem",
      en: "Documented endpoints for travel request lifecycle",
    },
    {
      pt: "Licenciado sob MIT, pronto para fork",
      en: "MIT-licensed, ready to fork",
    },
  ],
  repoUrl: "https://github.com/vinicius-ssantos/api_rest_aplicativo_cars",
  image: "/projects/api-rest-cars.png",
  updatedAt: "2024-08-10",
  featured: true,
};
