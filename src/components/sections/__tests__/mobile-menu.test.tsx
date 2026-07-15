import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "../mobile-menu";
import { translations } from "@/lib/translations";

describe("MobileMenu", () => {
  it("renders a closed menu with an accessible trigger", () => {
    render(<MobileMenu t={translations.en} lang="en" />);

    expect(screen.getByRole("button", { name: translations.en.a11y.openMenu })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on trigger click and lists every section link", async () => {
    const user = userEvent.setup();
    render(<MobileMenu t={translations.en} lang="en" />);

    await user.click(screen.getByRole("button", { name: translations.en.a11y.openMenu }));

    const dialog = await screen.findByRole("dialog");
    const nav = within(dialog);
    expect(nav.getByRole("link", { name: translations.en.nav.experience })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: translations.en.nav.stack })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: translations.en.nav.projects })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: translations.en.nav.caseStudy })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: translations.en.nav.about })).toBeInTheDocument();
  });

  it("closes when a section link is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileMenu t={translations.en} lang="en" />);

    await user.click(screen.getByRole("button", { name: translations.en.a11y.openMenu }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("link", { name: translations.en.nav.experience }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<MobileMenu t={translations.en} lang="en" />);

    const trigger = screen.getByRole("button", { name: translations.en.a11y.openMenu });
    await user.click(trigger);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
