const POLL_URL = 'https://api-open.data.gov.sg/v1/public/api/datasets/d_f91a8b057cfb2bebf2e531ad8061e1c1/poll-download';

export async function onRequest() {
  const pollRes = await fetch(POLL_URL);
  const pollData = await pollRes.json();
  const s3Url = pollData.data.url;

  const dataRes = await fetch(s3Url);
  const data = await dataRes.arrayBuffer();

  return new Response(data, {
    headers: {
      'Content-Type': 'application/geo+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
