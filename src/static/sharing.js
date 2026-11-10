export function buildActivityShareData(name, description, schedule, pageUrl) {
  const url = new URL(pageUrl);
  url.search = "";
  url.hash = `activity=${encodeURIComponent(name)}`;

  const title = `${name} - Mergington High School`;
  const text = `Join ${name} at Mergington High School! ${description}\nSchedule: ${schedule}`;
  const sharedUrl = url.href;
  const facebook = new URL("https://www.facebook.com/sharer/sharer.php");
  facebook.searchParams.set("u", sharedUrl);
  const x = new URL("https://twitter.com/intent/tweet");
  x.searchParams.set("text", title);
  x.searchParams.set("url", sharedUrl);
  const whatsapp = new URL("https://wa.me/");
  whatsapp.searchParams.set("text", `${text}\n${sharedUrl}`);

  return {
    title,
    text,
    url: sharedUrl,
    links: { Facebook: facebook.href, X: x.href, WhatsApp: whatsapp.href },
  };
}

export function createActivitySharing(name, description, schedule) {
  const data = buildActivityShareData(
    name, description, schedule, window.location.href
  );
  const controls = document.createElement("div");
  controls.className = "activity-sharing";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", `Share ${name}`);

  const label = document.createElement("span");
  label.className = "sharing-label";
  label.textContent = "Share activity:";
  controls.appendChild(label);

  Object.entries(data.links).forEach(([platform, href]) => {
    const link = document.createElement("a");
    link.className = "share-link";
    link.textContent = platform;
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Share ${name} on ${platform} (opens in a new tab)`);
    controls.appendChild(link);
  });

  const status = document.createElement("p");
  status.className = "sharing-status";
  status.setAttribute("role", "status");

  const manualLink = document.createElement("input");
  manualLink.type = "text";
  manualLink.readOnly = true;
  manualLink.value = data.url;
  manualLink.className = "sharing-manual-link hidden";
  manualLink.setAttribute("aria-label", `Link to ${name}`);

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "share-link";
  copyButton.textContent = "Copy link";
  copyButton.setAttribute("aria-label", `Copy link to ${name}`);
  copyButton.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable");
      }
      await navigator.clipboard.writeText(data.url);
      manualLink.classList.add("hidden");
      status.textContent = "Activity link copied!";
    } catch (error) {
      console.error("Could not copy activity link:", error);
      status.textContent = "Could not copy automatically. Select and copy the link below.";
      manualLink.classList.remove("hidden");
      manualLink.focus();
      manualLink.select();
    }
  });
  controls.appendChild(copyButton);

  if (typeof navigator.share === "function") {
    const shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.className = "share-link";
    shareButton.textContent = "More options";
    shareButton.setAttribute("aria-label", `Share ${name} using your device`);
    shareButton.addEventListener("click", async () => {
      try {
        await navigator.share({ title: data.title, text: data.text, url: data.url });
        status.textContent = "Activity shared!";
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Could not share activity:", error);
          status.textContent = "Could not open sharing. Use a social link or Copy link instead.";
        }
      }
    });
    controls.appendChild(shareButton);
  }

  controls.appendChild(status);
  controls.appendChild(manualLink);
  return controls;
}
