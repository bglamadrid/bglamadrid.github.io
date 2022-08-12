export function iconSrc(instanceData: {
  name: string,
  source: string,
  version?: string,
  variant?: string
}) {
  const iconName = instanceData.name;
  const iconSource = instanceData.source || undefined;
  let src = 'https://fakeimg.pl/32x32/4f1';
  if (iconSource === 'simple-icons') {
    const version = `v${instanceData.version || '7'}`;
    src = `https://cdn.jsdelivr.net/npm/simple-icons@${version}/icons/${iconName}.svg`;
  } else if (iconSource === 'fontawesome') {
    const version = `v${instanceData.version || '6'}`;
    const variant = instanceData.variant || 'solid';
    src = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${version}/svgs/${variant}/${iconName}.svg`;
  }
  return src;
}
