// ==========================================
// 1. DEPARTAMENTOS (Categorías principales)
// ==========================================
// Lista de los departamentos disponibles en la empresa.
// Cada uno tiene un ID único, un color base (hue), contador de guías, y una breve descripción.
const DEPARTMENTS = [
  {
    id: "compras",
    name: "Compras",
    hue: 262,
    count: 0,
    lead: "Órdenes de compra, recepción y facturas de proveedor",
  },
  {
    id: "ventas",
    name: "Ventas",
    hue: 152,
    count: 0,
    lead: "Solicitud de cotización, confirmación, facturas y entregas",
  },
  {
    id: "contabilidad",
    name: "Contabilidad",
    hue: 38,
    count: 2,
    lead: "Asientos, conciliaciones y cierres mensuales",
  },
  {
    id: "inventario",
    name: "Inventario",
    hue: 202,
    count: 0,
    lead: "Recepción de mercancía, ajustes y conteos físicos",
  },
  {
    id: "recepcion",
    name: "Recepción",
    hue: 346,
    count: 0,
    lead: "Mercancía entrante y devoluciones a proveedor",
  },
];
// ==========================================
// 2. GUÍAS (Catálogo de procesos)
// ==========================================
// Contiene la metadata de cada guía disponible en la plataforma.
// 'id' enlaza con los pasos detallados, 'dept' lo asocia a un departamento.
const GUIDES = [
  {
    id: "g01",
    dept: "contabilidad",
    title: "Emisión de pagos a proveedores",
    excerpt:
      "Flujo completo desde la notificación de actividad hasta la verificación del asiento base de efectivo y adjunto del comprobante bancario.",
    steps: 11,
    video: false,
    minutes: 7,
    updated: "18 may 2026",
    badge: "Nueva",
  },
  {
    id: "g02",
    dept: "contabilidad",
    title: "Asientos manuales: movimientos sin proyecto",
    excerpt:
      "Registro de gastos no vinculados a proyectos: referencia de segmento, fecha contable, validación de documentos y publicación del asiento.",
    steps: 10,
    video: false,
    minutes: 8,
    updated: "18 may 2026",
    badge: "Nueva",
  },
];
// ==========================================
// 3. PASOS DE EJEMPLO (Fallback)
// ==========================================
// Lista de pasos predeterminados que se muestran si una guía no tiene sus propios pasos definidos.
const SAMPLE_STEPS = [
  {
    n: 1,
    title: "Abrir el módulo Compras",
    body: "Desde el menú principal selecciona Compras → Órdenes. Verás el listado de OCs en estado borrador, aprobadas y cerradas.",
  },
  {
    n: 2,
    title: "Filtrar requisiciones aprobadas",
    body: "Activa el filtro Estado = Aprobada y Sin OC asociada para ver solo las pendientes de procesar.",
  },
  {
    n: 3,
    title: "Seleccionar la requisición a convertir",
    body: "Verifica que el solicitante, centro de costo y partidas sean correctos antes de continuar.",
  },
  {
    n: 4,
    title: "Convertir a Orden de Compra",
    body: 'Botón "Generar OC". El sistema arrastra automáticamente productos, cantidades y cuentas contables sugeridas.',
  },
  {
    n: 5,
    title: "Asignar proveedor y condiciones",
    body: "Si la requisición ya tenía proveedor sugerido, aparece preseleccionado. Confirma condiciones de pago y moneda.",
  },
  {
    n: 6,
    title: "Revisar precios y descuentos",
    body: "Compara contra el último precio de compra. Si hay variación >5% el sistema marca la línea en amarillo.",
  },
  {
    n: 7,
    title: "Adjuntar cotización del proveedor",
    body: "Sube el PDF de la cotización. Quedará vinculada permanentemente a la OC para auditoría.",
  },
  {
    n: 8,
    title: "Enviar a aprobación",
    body: "Según el monto, la OC requiere 1 o 2 niveles de aprobación. El sistema enruta automáticamente.",
  },
  {
    n: 9,
    title: "Notificación al proveedor",
    body: 'Una vez aprobada, marca "Enviar al proveedor" para mandar el PDF al correo registrado.',
  },
  {
    n: 10,
    title: "Seguimiento de la OC",
    body: "Desde el detalle puedes ver fecha estimada, recepciones parciales y facturas asociadas.",
  },
  {
    n: 11,
    title: "Cierre de la OC",
    body: "Cuando la recepción y la facturación coinciden, el sistema cierra la OC automáticamente.",
  },
  {
    n: 12,
    title: "Verificación contable",
    body: "Revisa que los asientos contables generados estén correctos en el módulo de Contabilidad.",
  },
];
// ==========================================
// 4. ACTIVIDAD RECIENTE (Sidebar)
// ==========================================
// Datos simulados para mostrar notificaciones o actualizaciones recientes en el menú lateral derecho.
const RECENT = [
  {
    type: "updated",
    title: "Crear una orden de compra desde una requisición",
    dept: "compras",
    when: "hace 2 días",
    who: "Mario G.",
  },
  {
    type: "new",
    title: "Recibir mercancía contra orden de compra",
    dept: "recepcion",
    when: "hace 4 días",
    who: "Laura V.",
  },
  {
    type: "new",
    title: "Generar cotización, convertir a factura y cobrar",
    dept: "ventas",
    when: "hace 5 días",
    who: "Mario G.",
  },
  {
    type: "updated",
    title: "Conciliación bancaria mensual",
    dept: "contabilidad",
    when: "hace 1 sem.",
    who: "Pedro R.",
  },
  {
    type: "updated",
    title: "Registrar factura de proveedor contra una OC",
    dept: "compras",
    when: "hace 2 sem.",
    who: "Mario G.",
  },
];
// ==========================================
// 5. PASOS DETALLADOS POR GUÍA
// ==========================================
// Diccionario que asocia el 'id' de una guía (ej. "g01") con sus pasos específicos.
// Cada paso puede incluir un título, descripción e imagen adjunta.
const STEPS_BY_GUIDE = {
  g01: [
    {
      n: 1,
      title: "Recibir notificación de actividad",
      body: "Espera la notificación en la parte superior del centro de actividades. El número en el ícono indica cuántas actividades tienes pendientes de atender.",
      img: "imgs/p1_00.png",
    },
    {
      n: 2,
      title: "Localizar la actividad pendiente",
      body: "Haz clic en el ícono del centro de actividades. Se desplegará el listado de pagos con columnas: Fecha, Número, Diario, Método de pago, Cliente, Importe y Estado.",
      img: "imgs/p1_01.png",
    },
    {
      n: 3,
      title: "Ingresar a la factura de proveedor",
      body: "Selecciona el registro de la factura correspondiente. Verifica que tenga banco receptor asignado y que el estado sea 'Facturado'.",
    },
    {
      n: 4,
      title: "Clic en el botón Pagar",
      body: "Dentro de la factura de proveedor, haz clic en el botón 'Pagar' ubicado en la barra de acciones superior, junto a Imprimir, Nota de crédito y Restablecer a borrador.",
      img: "imgs/p1_02.png",
    },
    {
      n: 5,
      title: "Seleccionar el Diario",
      body: "En el formulario de pago, selecciona el Diario que corresponde al banco desde el cual se realizará la transferencia (ej. 5974_BNMX_MXN).",
      img: "imgs/p2_03.png",
    },
    {
      n: 6,
      title: "Establecer Forma de pago",
      body: "La Forma de pago siempre debe ser 'Transferencia electrónica de pagos'. Este campo no debe modificarse.",
      img: "imgs/p2_03.png",
    },
    {
      n: 7,
      title: "Capturar el Importe",
      body: "Verifica o captura el importe a pagar. En caso de pago parcial, ajusta el monto al importe que se transferirá en esta emisión.",
      img: "imgs/p2_03.png",
    },
    {
      n: 8,
      title: "Confirmar la Fecha de pago",
      body: "Establece la fecha en que se emite el pago. Debe coincidir con la fecha del movimiento bancario real.",
      img: "imgs/p2_03.png",
    },
    {
      n: 9,
      title: "Crear el pago y revisar estado",
      body: "Haz clic en 'Crear pago'. Si el pago es parcial, la factura quedará marcada con sello 'PARCIAL'. Accede al ícono 'Pagos' para ingresar al registro del pago creado.",
      img: "imgs/p3_05.png",
    },
    {
      n: 10,
      title: "Adjuntar comprobante de pago",
      body: "En el registro del pago, adjunta el comprobante de transferencia bancaria usando el ícono de clip. Verifica que el estado del pago sea 'Pagado'.",
      img: "imgs/p4_07.png",
    },
    {
      n: 11,
      title: "Verificar asiento base de efectivo",
      body: "Desde la factura, accede a 'Asientos de base de efectivo'. Verifica que los apuntes incluyan: 899.01.99 Base Imponible (débito y crédito), 118.01.01 IVA acreditable pagado y 119.01.01 IVA pendiente de pago, todos cuadrando correctamente.",
      img: "imgs/p5_09.png",
    },
  ],
  g02: [
    {
      n: 1,
      title: "Ingresar al módulo de Contabilidad",
      body: "Desde el menú principal del ERP, localiza y haz clic en el módulo 'Contabilidad'. Verifica antes de continuar que estás en la empresa correspondiente al gasto.",
      img: "imgs/p6_10.png",
    },
    {
      n: 2,
      title: "Ir a Asientos contables",
      body: "En el menú superior, selecciona Contabilidad → Asientos contables. Verás el listado de asientos con su estado (Borrador, Registrado, Pagado).",
      img: "imgs/p6_11.png",
    },
    {
      n: 3,
      title: "Crear nuevo asiento contable",
      body: "Haz clic en el botón 'Nuevo'. Confirma que la empresa indicada en la esquina superior es la que corresponde al movimiento que vas a registrar.",
      img: "imgs/p6_12.png",
    },
    {
      n: 4,
      title: "Asignar la Referencia del segmento",
      body: "En el campo Referencia captura el segmento al que corresponde el gasto. Identifícalo en el diario de operaciones, en la columna Segmento (ej. PROMOCIONALES, GASTOS GENERALES).",
      img: "imgs/p7_13.png",
    },
    {
      n: 5,
      title: "Establecer la Fecha contable",
      body: "La fecha contable debe ser la fecha en que fue realizado el pago, no la fecha actual. Este dato es crítico para la conciliación bancaria.",
      img: "imgs/p7_14.png",
    },
    {
      n: 6,
      title: "Completar datos del Asiento Manual",
      body: "Activa la casilla 'Asiento Manual'. El sistema solicitará automáticamente quién solicitó el pago y quién lo autorizó. El personal de tesorería es responsable de asignar estos campos.",
      img: "imgs/p7_15.png",
    },
    {
      n: 7,
      title: "Validar y adjuntar documentos",
      body: "Valida en la carpeta de tesorería que las facturas y comprobantes de pago correspondan al movimiento bancario. Adjunta los archivos PDF o XML directamente al asiento manual.",
      img: "imgs/p8_16.png",
    },
    {
      n: 8,
      title: "Asignar tarea si falta información",
      body: "Si la información está incompleta, programa una actividad tipo 'Solicitud de Auditoría Financiera' asignada a la persona responsable, indicando qué dato falta (autorizador, solicitante, factura, etc.).",
      img: "imgs/p8_17.png",
    },
    {
      n: 9,
      title: "Verificar los 7 requisitos indispensables",
      body: "Antes de publicar confirma: (1) factura o comprobación del gasto, (2) segmento correcto, (3) quién autoriza y quién solicita, (4) referencia con el segmento, (5) fecha igual a la del pago, (6) apuntes contables desglosados correctamente, (7) banco correspondiente.",
      img: "imgs/p9_18.png",
    },
    {
      n: 10,
      title: "Editar nombre y publicar el asiento",
      body: "Si necesitas corregir el nombre del asiento, usa 'Restablecer a borrador', edita el nombre con un identificador claro (ej. 'Reembolso Juan Coronel-3') y haz clic en 'Publicar'.",
      img: "imgs/p10_20.png",
    },
  ],
};
// ==========================================
// 6. FUNCIONES DE ACCESO A DATOS
// ==========================================

// Devuelve los pasos de una guía si existen, o los pasos de ejemplo por defecto.
function getStepsForGuide(id) {
  return STEPS_BY_GUIDE[id] || SAMPLE_STEPS;
}

// Obtiene el progreso guardado localmente (para persistir entre recargas)
function getProgress() {
  try {
    return JSON.parse(localStorage.getItem("erp_progress") || "{}");
  } catch {
    return {};
  }
}
// Guarda el progreso de una guía específica en el almacenamiento del navegador (localStorage)
function setProgress(id, step) {
  const p = getProgress();
  p[id] = step;
  localStorage.setItem("erp_progress", JSON.stringify(p));
}
// Obtiene el paso actual de una guía específica (0 por defecto)
function getGuideProgress(id) {
  return getProgress()[id] || 0;
}
// ==========================================
// 7. FAVORITOS Y UTILIDADES DE COLOR
// ==========================================

// Funciones para manejar guías guardadas como favoritos (bookmarks)
function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem("erp_bm") || "[]");
  } catch {
    return [];
  }
}
function toggleBookmark(id) {
  let bm = getBookmarks();
  if (bm.includes(id)) bm = bm.filter((x) => x !== id);
  else bm.push(id);
  localStorage.setItem("erp_bm", JSON.stringify(bm));
  return bm.includes(id);
}
function isBookmarked(id) {
  return getBookmarks().includes(id);
}
function deptColor(hue, l = 60, c = 0.18) {
  return `oklch(${l}% ${c} ${hue})`;
}
function deptTint(hue, a = 0.14) {
  return `oklch(60% 0.16 ${hue} / ${a})`;
}
