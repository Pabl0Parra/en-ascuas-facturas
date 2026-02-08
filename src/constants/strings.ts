export const STRINGS = {
  app: {
    name: '',
    tagline: '',
  },

  navigation: {
    home: 'Inicio',
    clientes: 'Clientes',
    historial: 'Historial',
    nuevaFactura: 'Nueva Factura',
    nuevoPresupuesto: 'Nuevo Presupuesto',
  },

  document: {
    factura: 'FACTURA',
    presupuesto: 'PRESUPUESTO',
    numeroDocumento: 'Nº Documento',
    fechaDocumento: 'Fecha',
    datosEmpresa: 'DATOS',
    datosFacturacion: 'DATOS DE FACTURACIÓN',
  },

  form: {
    descripcion: 'Descripción',
    cantidad: 'Cantidad',
    precio: 'Precio',
    importe: 'Importe',
    añadirLinea: 'Añadir línea',
    eliminar: 'Eliminar',
  },

  iva: {
    label: 'IVA',
    inversionSujetoPasivo: 'Inversión del sujeto pasivo',
    inversionNota: 'INVERSIÓN SUJETO PASIVO IVA 0%',
    normal: 'IVA 21%',
  },

  totals: {
    base: 'BASE',
    iva: 'IVA',
    total: 'TOTAL',
  },

  payment: {
    metodoPago: 'MÉTODO DE PAGO',
    transferencia: 'TRANSFERENCIA',
  },

  actions: {
    guardar: 'Guardar',
    generarPDF: 'Generar PDF',
    compartir: 'Compartir',
    cancelar: 'Cancelar',
    editar: 'Editar',
    eliminar: 'Eliminar',
    nuevoCliente: 'Nuevo Cliente',
    seleccionarCliente: 'Seleccionar cliente',
  },

  client: {
    nombre: 'Nombre / Razón Social',
    direccion: 'Dirección',
    codigoPostal: 'Código Postal',
    ciudad: 'Ciudad',
    provincia: 'Provincia',
    nifCif: 'NIF / CIF',
    email: 'Email (opcional)',
    telefono: 'Teléfono (opcional)',
  },

  empty: {
    clientes: 'No hay clientes guardados',
    historial: 'No hay documentos',
    lineas: 'Añade al menos una línea',
  },

  errors: {
    campoRequerido: 'Este campo es requerido',
    seleccionaCliente: 'Selecciona un cliente',
    añadeLinea: 'Añade al menos una línea',
    cantidadInvalida: 'Cantidad debe ser mayor a 0',
    precioInvalido: 'Precio debe ser mayor a 0',
  },

  success: {
    clienteGuardado: 'Cliente guardado',
    documentoGenerado: 'Documento generado correctamente',
    pdfGuardado: 'PDF guardado',
  },
} as const;
