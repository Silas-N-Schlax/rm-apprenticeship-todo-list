export function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag)

  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) continue
    if (key === 'class') el.className = value
    else if (key === 'text') el.textContent = value
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value)
    else el.setAttribute(key, value)
  }

  for (const child of [].concat(children)) {
    if (child == null) continue
    el.append(child instanceof Node ? child : document.createTextNode(child))
  }

  return el
}

export function icon(name, extraClass = '') {
  return h('span', { class: `icon li li-${name}${extraClass ? ` ${extraClass}` : ''}`, 'aria-hidden': 'true' })
}
