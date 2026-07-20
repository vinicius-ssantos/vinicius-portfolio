import type { Lang } from "@/lib/i18n";
import type { ProjectMeta, ProjectText } from "../types";

export const springcloudMeta: ProjectMeta = {
  slug: "springcloud",
  name: "SpringCloud",
  stack: [
    "Java 11",
    "Spring Boot 2.6.5",
    "Spring Cloud 2021.0.1",
    "Spring Cloud Netflix Eureka",
    "Spring Cloud Gateway",
    "Spring Security OAuth2",
    "RabbitMQ",
    "Keycloak",
    "H2",
    "Maven",
    "Lombok",
  ],
  repoUrl: "https://github.com/vinicius-ssantos/SpringCloud",
  image: "/projects/springcloud.png",
  updatedAt: "2026-04-27",
  featured: true,
};

const pt: ProjectText = {
  tagline:
    "Ecossistema de microserviços para avaliação de cartão de crédito em Java + Spring Cloud",
  description:
    "Implementação nível estudo de uma arquitetura de microserviços simulando um ecossistema de avaliação de cartão de crédito. Serviços independentes para clientes, cartões e avaliação de crédito, unidos com Eureka, API Gateway, RabbitMQ e Keycloak.",
  problem:
    "Construir um setup realista de microserviços que exercite os padrões que você realmente vê em produção: service discovery, gateway routing, comunicação sync + async, recursos protegidos por OAuth2, observabilidade — sem pular as partes difíceis.",
  approach: [
    "Eureka Server registra cada microserviço; gateway usa discovery para rotear por nome de serviço.",
    "Spring Cloud Gateway expõe um único ponto de entrada em :8080 com discovery-locator habilitado.",
    "RabbitMQ carrega o fluxo assíncrono de emissão de cartões — sync HTTP para leituras, async para escritas.",
    "Keycloak em :8081 emite JWTs; o gateway atua como OAuth2 resource server e encaminha tokens downstream.",
    "Persistência H2 in-memory por serviço mantém o demo self-contained; OpenAPI + Actuator de graça.",
  ],
  role: "Projeto pessoal — autor único",
  highlights: [
    "4 serviços independentes + 1 gateway + 1 discovery server",
    "Fluxo completo OAuth2/JWT com Keycloak como IdP",
    "Padrões de comunicação tanto sync (REST) quanto async (RabbitMQ)",
    "Endpoints documentados para clientes, cartões e avaliação de crédito",
  ],
};

const en: ProjectText = {
  tagline: "Microservices ecosystem for credit card evaluation in Java + Spring Cloud",
  description:
    "Study-grade implementation of a microservices architecture simulating a credit card evaluation ecosystem. Independent services for customers, cards and credit evaluation, glued together with Eureka, an API Gateway, RabbitMQ and Keycloak.",
  problem:
    "Build a realistic microservices setup that exercises the patterns you actually see in production: service discovery, gateway routing, sync + async communication, OAuth2-protected resources, observability — without skipping the hard parts.",
  approach: [
    "Eureka Server registers every microservice; gateway uses discovery to route by service name.",
    "Spring Cloud Gateway exposes a single entry point on :8080 with discovery-locator enabled.",
    "RabbitMQ carries the asynchronous card-issuance flow (queue: emissao-cartoes) — sync HTTP for reads, async for writes.",
    "Keycloak on :8081 issues JWTs; the gateway acts as OAuth2 resource server and forwards tokens downstream.",
    "H2 in-memory persistence per service keeps the demo self-contained; OpenAPI + Actuator endpoints for free.",
  ],
  role: "Personal project — sole author",
  highlights: [
    "4 independent services + 1 gateway + 1 discovery server",
    "Full OAuth2/JWT flow with Keycloak as IdP",
    "Both sync (REST) and async (RabbitMQ) communication patterns",
    "Documented endpoints for customers, cards and credit evaluation",
  ],
};

const text: Record<Lang, ProjectText> = { pt, en };

export function getSpringcloud(lang: Lang) {
  return { ...springcloudMeta, ...text[lang]! };
}
