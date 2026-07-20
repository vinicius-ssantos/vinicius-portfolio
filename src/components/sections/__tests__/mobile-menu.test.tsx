import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { MobileMenu } from "../mobile-menu";
import messages from "../../../../messages/en.json";

function renderMenu() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MobileMenu lang="en" />
    </NextIntlClientProvider>,
  );
}

describe("MobileMenu", () => {
  it("renders a closed menu with an accessible trigger", () => {
    renderMenu();

    expect(screen.getByRole("button", { name: messages.a11y.openMenu })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on trigger click and lists every section link", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: messages.a11y.openMenu }));

    const dialog = await screen.findByRole("dialog");
    const nav = within(dialog);
    expect(nav.getByRole("link", { name: messages.nav.experience })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: messages.nav.stack })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: messages.nav.projects })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: messages.nav.caseStudy })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: messages.nav.about })).toBeInTheDocument();
  });

  it("closes when a section link is clicked", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: messages.a11y.openMenu }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("link", { name: messages.nav.experience }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: messages.a11y.openMenu });
    await user.click(trigger);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
