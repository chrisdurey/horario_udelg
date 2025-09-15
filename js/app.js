/* Main application logic - versión corregida con validación de conflictos */

// Navigation
const sections = document.querySelectorAll('main section');
const navButtons = document.querySelectorAll('header nav button');

function setActiveSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    navButtons.forEach(b => b.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    const navId = `nav-${id.split('-')[1]}`;
    const navBtn = document.getElementById(navId);
    if (navBtn) navBtn.classList.add('active');
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        setActiveSection(`section-${button.id.split('-')[1]}`);
        if (button.id === 'nav-carreras') loadCarreras();
        if (button.id === 'nav-materias') loadMaterias();
        if (button.id === 'nav-maestros') loadMaestros();
        if (button.id === 'nav-horarios') cargarCarrerasSelect();
    });
});

// Generate unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Helper to safely get arrays from Storage
function safeGetArray(key) {
    const val = Storage.get(key);
    return Array.isArray(val) ? val : [];
}

// ------------------------- CARRERAS (con Grado y Grupo) -------------------------
const carreraInput = document.getElementById('input-carrera');
const gradoCarreraInput = document.getElementById('input-grado-carrera');
const grupoCarreraInput = document.getElementById('input-grupo-carrera');
const btnAgregarCarrera = document.getElementById('btn-agregar-carrera');
const listaCarreras = document.getElementById('lista-carreras');
const searchCarrera = document.getElementById('search-carrera');

function loadCarreras() {
    if (!listaCarreras) return;
    listaCarreras.innerHTML = '';
    const carreras = safeGetArray('carreras');
    carreras.forEach(carrera => {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${carrera.nombre}</strong> <span class="small-muted">Grado: ${carrera.grado || '-'} / Grupo: ${carrera.grupo || '-'}</span></div>`;
        const actions = document.createElement('div');
        actions.classList.add('actions');
        const modBtn = document.createElement('button');
        modBtn.textContent = 'Modificar';
        modBtn.onclick = () => modificarCarrera(carrera.id);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.onclick = () => eliminarCarrera(carrera.id);
        actions.appendChild(modBtn);
        actions.appendChild(delBtn);
        li.appendChild(actions);
        listaCarreras.appendChild(li);
    });
}

if (btnAgregarCarrera) {
    btnAgregarCarrera.addEventListener('click', () => {
        const nombre = carreraInput.value.trim();
        const grado = gradoCarreraInput.value.trim();
        const grupo = grupoCarreraInput.value.trim();
        if (nombre === '') {
            alert('Ingrese un nombre válido para la carrera');
            return;
        }
        const nuevaCarrera = { id: generateId(), nombre: nombre, grado: grado || '', grupo: grupo || '' };
        Storage.add('carreras', nuevaCarrera);
        carreraInput.value = '';
        gradoCarreraInput.value = '';
        grupoCarreraInput.value = '';
        loadCarreras();
        cargarCarrerasSelect();
        cargarHorariosGuardadosSelect();
    });
}

function modificarCarrera(id) {
    const carreras = safeGetArray('carreras');
    const carrera = carreras.find(c => c.id === id);
    if (!carrera) return;
    const nuevoNombre = prompt('Modificar nombre de la carrera:', carrera.nombre);
    if (!nuevoNombre) return;
    const nuevoGrado = prompt('Modificar grado:', carrera.grado || '');
    if (nuevoGrado === null) return;
    const nuevoGrupo = prompt('Modificar grupo:', carrera.grupo || '');
    if (nuevoGrupo === null) return;
    carrera.nombre = nuevoNombre.trim();
    carrera.grado = nuevoGrado.trim();
    carrera.grupo = nuevoGrupo.trim();
    Storage.update('carreras', id, carrera);
    loadCarreras();
    cargarCarrerasSelect();
    cargarHorariosGuardadosSelect();
}

function eliminarCarrera(id) {
    if (confirm('¿Está seguro de eliminar esta carrera?')) {
        Storage.delete('carreras', id);
        loadCarreras();
        cargarCarrerasSelect();
        cargarHorariosGuardadosSelect();
    }
}

if (searchCarrera) {
    searchCarrera.addEventListener('input', () => {
        const filter = searchCarrera.value.toLowerCase();
        listaCarreras.innerHTML = '';
        const carreras = safeGetArray('carreras').filter(c => c.nombre.toLowerCase().includes(filter));
        carreras.forEach(carrera => {
            const li = document.createElement('li');
            li.innerHTML = `<div><strong>${carrera.nombre}</strong> <span class="small-muted">Grado: ${carrera.grado || '-'} / Grupo: ${carrera.grupo || '-'}</span></div>`;
            const actions = document.createElement('div');
            actions.classList.add('actions');
            const modBtn = document.createElement('button');
            modBtn.textContent = 'Modificar';
            modBtn.onclick = () => modificarCarrera(carrera.id);
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Eliminar';
            delBtn.onclick = () => eliminarCarrera(carrera.id);
            actions.appendChild(modBtn);
            actions.appendChild(delBtn);
            li.appendChild(actions);
            listaCarreras.appendChild(li);
        });
    });
}

// Load Carreras into select for Horarios
function cargarCarrerasSelect() {
    const select = document.getElementById('select-carrera-horario');
    if (!select) return;
    select.innerHTML = '<option value="">-- Seleccione Carrera --</option>';
    const carreras = safeGetArray('carreras');
    carreras.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.nombre} (G:${c.grado || '-'} - ${c.grupo || '-'})`;
        select.appendChild(option);
    });
}

// ------------------------- MATERIAS (con Aula) -------------------------
const materiaInput = document.getElementById('input-materia');
const especialidadMateriaInput = document.getElementById('input-especialidad-materia');
const aulaMateriaInput = document.getElementById('input-aula-materia');
const btnAgregarMateria = document.getElementById('btn-agregar-materia');
const listaMaterias = document.getElementById('lista-materias');
const searchMateria = document.getElementById('search-materia');

function loadMaterias() {
    if (!listaMaterias) return;
    listaMaterias.innerHTML = '';
    const materias = safeGetArray('materias');
    materias.forEach(materia => {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${materia.nombre}</strong> <span class="small-muted">Especialidad: ${materia.especialidad || '-'} / Aula: ${materia.aula || '-'}</span></div>`;
        const actions = document.createElement('div');
        actions.classList.add('actions');
        const modBtn = document.createElement('button');
        modBtn.textContent = 'Modificar';
        modBtn.onclick = () => modificarMateria(materia.id);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.onclick = () => eliminarMateria(materia.id);
        actions.appendChild(modBtn);
        actions.appendChild(delBtn);
        li.appendChild(actions);
        listaMaterias.appendChild(li);
    });
}

if (btnAgregarMateria) {
    btnAgregarMateria.addEventListener('click', () => {
        const nombre = materiaInput.value.trim();
        const especialidad = especialidadMateriaInput.value.trim();
        const aula = aulaMateriaInput.value.trim();
        if (!nombre || !especialidad) {
            alert('Por favor, ingrese nombre y especialidad de la materia.');
            return;
        }
        const nuevaMateria = { id: generateId(), nombre, especialidad, aula: aula || '' };
        Storage.add('materias', nuevaMateria);
        materiaInput.value = '';
        especialidadMateriaInput.value = '';
        aulaMateriaInput.value = '';
        loadMaterias();
    });
}

function modificarMateria(id) {
    const materias = safeGetArray('materias');
    const materia = materias.find(m => m.id === id);
    if (!materia) return;
    const nuevoNombre = prompt('Modificar nombre de la materia:', materia.nombre);
    if (nuevoNombre === null) return;
    const nuevaEspecialidad = prompt('Modificar especialidad:', materia.especialidad || '');
    if (nuevaEspecialidad === null) return;
    const nuevaAula = prompt('Modificar aula:', materia.aula || '');
    if (nuevaAula === null) return;
    materia.nombre = nuevoNombre.trim();
    materia.especialidad = nuevaEspecialidad.trim();
    materia.aula = nuevaAula.trim();
    Storage.update('materias', id, materia);
    loadMaterias();
}

function eliminarMateria(id) {
    if (confirm('¿Está seguro de eliminar esta materia?')) {
        Storage.delete('materias', id);
        loadMaterias();
    }
}

if (searchMateria) {
    searchMateria.addEventListener('input', () => {
        const filter = searchMateria.value.toLowerCase();
        listaMaterias.innerHTML = '';
        const materias = safeGetArray('materias').filter(m => m.nombre.toLowerCase().includes(filter));
        materias.forEach(materia => {
            const li = document.createElement('li');
            li.innerHTML = `<div><strong>${materia.nombre}</strong> <span class="small-muted">Especialidad: ${materia.especialidad || '-'} / Aula: ${materia.aula || '-'}</span></div>`;
            const actions = document.createElement('div');
            actions.classList.add('actions');
            const modBtn = document.createElement('button');
            modBtn.textContent = 'Modificar';
            modBtn.onclick = () => modificarMateria(materia.id);
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Eliminar';
            delBtn.onclick = () => eliminarMateria(materia.id);
            actions.appendChild(modBtn);
            actions.appendChild(delBtn);
            li.appendChild(actions);
            listaMaterias.appendChild(li);
        });
    });
}

// ------------------------- MAESTROS -------------------------
const nombreMaestroInput = document.getElementById('input-nombre-maestro');
const especialidadMaestroInput = document.getElementById('input-especialidad-maestro');
const btnAgregarMaestro = document.getElementById('btn-agregar-maestro');
const listaMaestros = document.getElementById('lista-maestros');
const searchMaestro = document.getElementById('search-maestro');

function loadMaestros() {
    if (!listaMaestros) return;
    listaMaestros.innerHTML = '';
    const maestros = safeGetArray('maestros');
    maestros.forEach(maestro => {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${maestro.nombre}</strong> <span class="small-muted">Especialidad: ${maestro.especialidad || '-'}</span></div>`;
        const actions = document.createElement('div');
        actions.classList.add('actions');
        const modBtn = document.createElement('button');
        modBtn.textContent = 'Modificar';
        modBtn.onclick = () => modificarMaestro(maestro.id);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.onclick = () => eliminarMaestro(maestro.id);
        actions.appendChild(modBtn);
        actions.appendChild(delBtn);
        li.appendChild(actions);
        listaMaestros.appendChild(li);
    });
}

if (btnAgregarMaestro) {
    btnAgregarMaestro.addEventListener('click', () => {
        const nombre = nombreMaestroInput.value.trim();
        const especialidad = especialidadMaestroInput.value.trim();
        if (!nombre || !especialidad) {
            alert('Por favor, ingrese nombre y especialidad del maestro.');
            return;
        }
        const nuevoMaestro = { id: generateId(), nombre, especialidad };
        Storage.add('maestros', nuevoMaestro);
        nombreMaestroInput.value = '';
        especialidadMaestroInput.value = '';
        loadMaestros();
    });
}

function modificarMaestro(id) {
    const maestros = safeGetArray('maestros');
    const maestro = maestros.find(m => m.id === id);
    if (!maestro) return;
    const nuevoNombre = prompt('Modificar nombre del maestro:', maestro.nombre);
    if (nuevoNombre === null) return;
    const nuevaEspecialidad = prompt('Modificar especialidad:', maestro.especialidad || '');
    if (nuevaEspecialidad === null) return;
    maestro.nombre = nuevoNombre.trim();
    maestro.especialidad = nuevaEspecialidad.trim();
    Storage.update('maestros', id, maestro);
    loadMaestros();
}

function eliminarMaestro(id) {
    if (confirm('¿Está seguro de eliminar este maestro?')) {
        Storage.delete('maestros', id);
        loadMaestros();
    }
}

if (searchMaestro) {
    searchMaestro.addEventListener('input', () => {
        const filter = searchMaestro.value.toLowerCase();
        listaMaestros.innerHTML = '';
        const maestros = safeGetArray('maestros').filter(m => m.nombre.toLowerCase().includes(filter));
        maestros.forEach(maestro => {
            const li = document.createElement('li');
            li.innerHTML = `<div><strong>${maestro.nombre}</strong> <span class="small-muted">Especialidad: ${maestro.especialidad || '-'}</span></div>`;
            const actions = document.createElement('div');
            actions.classList.add('actions');
            const modBtn = document.createElement('button');
            modBtn.textContent = 'Modificar';
            modBtn.onclick = () => modificarMaestro(maestro.id);
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Eliminar';
            delBtn.onclick = () => eliminarMaestro(maestro.id);
            actions.appendChild(modBtn);
            actions.appendChild(delBtn);
            li.appendChild(actions);
            listaMaestros.appendChild(li);
        });
    });
}

// ------------------------- HORARIOS -------------------------

// DOM references
const tablaHorarioSemanalBody = document.querySelector('#tabla-horario-semanal tbody');
const tablaHorarioSabatinoBody = document.querySelector('#tabla-horario-sabatino tbody');
const btnGuardarHorario = document.getElementById('btn-guardar-horario');
const btnActualizarHorario = document.getElementById('btn-actualizar-horario');
const selectCarreraHorario = document.getElementById('select-carrera-horario');
const btnPreviewHorario = document.getElementById('btn-preview-horario');
const btnExportExcel = document.getElementById('btn-exportar-excel');
const btnExportPDF = document.getElementById('btn-exportar-pdf');
const selectHorariosGuardados = document.getElementById('select-horarios-guardados');
const btnCargarHorario = document.getElementById('btn-cargar-horario');
const btnEliminarHorario = document.getElementById('btn-eliminar-horario');
const previewContainer = document.getElementById('preview-horario');

// Times definitions (skip the 09:30 break; we'll render it as a break row)
const tiemposSemana = ['07:00', '07:50', '08:40', '10:00', '10:50', '11:40', '12:30', '13:20'];
const tiemposSabatino = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

// horarioTemporal structure
let horarioTemporal = { semanal: {}, sabatino: [] };
let currentHorarioId = null; // id of loaded/edited horario

function limpiarHorarioTemporal() {
    horarioTemporal = { semanal: { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [] }, sabatino: [] };
    tiemposSemana.forEach(() => {
        // nothing - arrays will be filled on update
    });
}

// Generate semanal table (with break row at 09:30)
function generarTablaHorarioSemanal() {
    if (!tablaHorarioSemanalBody) return;
    tablaHorarioSemanalBody.innerHTML = '';

    // Generate morning rows (before break)
    for (let i = 0; i < tiemposSemana.length; i++) {
        // Insert break row before '10:00' (i === 3)
        if (i === 3) {
            const trBreak = document.createElement('tr');
            trBreak.classList.add('break-row');
            const tdTime = document.createElement('td');
            tdTime.textContent = '09:30';
            const tdBreak = document.createElement('td');
            tdBreak.colSpan = 5;
            tdBreak.textContent = 'RECESO 09:30 - 10:00 (No asignable)';
            trBreak.appendChild(tdTime);
            trBreak.appendChild(tdBreak);
            tablaHorarioSemanalBody.appendChild(trBreak);
        }

        const hora = tiemposSemana[i];
        const tr = document.createElement('tr');
        const tdHora = document.createElement('td');
        tdHora.textContent = hora;
        tr.appendChild(tdHora);

        ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].forEach(dia => {
            const td = document.createElement('td');
            td.dataset.dia = dia;
            td.dataset.index = i;
            td.classList.add('celda-horario');
            td.style.cssText = 'min-height: 48px;';
            td.addEventListener('click', function() {
                abrirModalAsignacion(this);
            });
            tr.appendChild(td);
        });
        tablaHorarioSemanalBody.appendChild(tr);
    }
}

// Generate sabatino table
function generarTablaHorarioSabatino() {
    if (!tablaHorarioSabatinoBody) return;
    tablaHorarioSabatinoBody.innerHTML = '';
    tiemposSabatino.forEach((hora, index) => {
        const tr = document.createElement('tr');
        const tdHora = document.createElement('td');
        tdHora.textContent = hora;
        tr.appendChild(tdHora);
        const td = document.createElement('td');
        td.dataset.dia = 'sabado';
        td.dataset.index = index;
        td.classList.add('celda-horario');
        td.style.cssText = 'min-height: 48px;';
        td.addEventListener('click', function() {
            abrirModalAsignacion(this);
        });
        tr.appendChild(td);
        tablaHorarioSabatinoBody.appendChild(tr);
    });
}

// Open modal to assign materia+maestro
function abrirModalAsignacion(celda) {
    const materias = safeGetArray('materias');
    const maestros = safeGetArray('maestros');

    if (materias.length === 0) {
        alert('No hay materias disponibles. Agregue materias primero.');
        return;
    }
    if (maestros.length === 0) {
        alert('No hay maestros disponibles. Agregue maestros primero.');
        return;
    }

    // Build modal
    const modal = document.createElement('div');
    modal.id = 'modal-asignacion';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999;';
    modal.innerHTML = `
        <div style="background:#fff;padding:18px;border-radius:8px;width:420px;max-width:95%;">
            <h3 style="margin-top:0">Asignar Materia / Maestro</h3>
            <p>Día: <strong>${celda.dataset.dia}</strong> - Hora: <strong>${celda.parentElement.firstChild.textContent}</strong></p>
            <div style="margin-bottom:8px;">
                <label>Materia</label>
                <select id="modal-select-materia" style="width:100%;padding:8px;margin-top:6px;">
                    <option value="">-- Seleccione Materia --</option>
                    ${materias.map(m=>`<option value="${m.id}">${m.nombre} (${m.aula||'-'})</option>`).join('')}
                </select>
            </div>
            <div style="margin-bottom:10px;">
                <label>Maestro</label>
                <select id="modal-select-maestro" style="width:100%;padding:8px;margin-top:6px;">
                    <option value="">-- Seleccione Maestro --</option>
                    ${maestros.map(m=>`<option value="${m.id}">${m.nombre}</option>`).join('')}
                </select>
            </div>
            <div style="text-align:right;">
                <button id="modal-limpiar" style="background:#f44336;color:#fff;padding:8px 12px;border-radius:6px;border:0;margin-right:8px;">Limpiar</button>
                <button id="modal-guardar" style="background:#4caf50;color:#fff;padding:8px 12px;border-radius:6px;border:0;margin-right:8px;">Guardar</button>
                <button id="modal-cancel" style="background:#ccc;padding:8px 12px;border-radius:6px;border:0;">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Prefill if exists
    if (celda.dataset.materiaId) document.getElementById('modal-select-materia').value = celda.dataset.materiaId;
    if (celda.dataset.maestroId) document.getElementById('modal-select-maestro').value = celda.dataset.maestroId;

    // Attach handlers
    document.getElementById('modal-cancel').onclick = () => { document.body.removeChild(modal); };
    document.getElementById('modal-limpiar').onclick = () => {
        celda.innerHTML = '';
        celda.dataset.materiaId = '';
        celda.dataset.maestroId = '';
        actualizarHorarioTemporal();
        document.body.removeChild(modal);
    };
    document.getElementById('modal-guardar').onclick = () => {
        guardarAsignacionModal(celda);
        document.body.removeChild(modal);
    };
}

// FUNCIÓN CORREGIDA: Validación de conflictos entre carreras
function guardarAsignacionModal(celda) {
    const materiaId = document.getElementById('modal-select-materia').value;
    const maestroId = document.getElementById('modal-select-maestro').value;
    if (!materiaId || !maestroId) { alert('Seleccione materia y maestro'); return; }

    const materias = safeGetArray('materias');
    const maestros = safeGetArray('maestros');
    const materia = materias.find(m=>m.id===materiaId);
    const maestro = maestros.find(m=>m.id===maestroId);
    if (!materia || !maestro) { alert('Error al obtener materia o maestro'); return; }

    // Obtener la carrera actual
    const carreraActualId = selectCarreraHorario.value;
    if (!carreraActualId) {
        alert('Debe seleccionar una carrera primero');
        return;
    }

    // Determinar el slot descriptor
    const dia = celda.dataset.dia;
    const index = parseInt(celda.dataset.index, 10);
    
    // Obtener el tiempo correspondiente
    let tiempoSlot;
    if (dia === 'sabado') {
        tiempoSlot = tiemposSabatino[index];
    } else {
        tiempoSlot = tiemposSemana[index];
    }

    // VALIDACIÓN CORREGIDA: Verificar conflictos entre diferentes carreras
    const horariosGuardados = safeGetArray('horarios');
    
    // Función para verificar conflictos en un horario específico
    function verificarConflictoEnHorario(horario, carreraId) {
        // Solo verificar conflictos con otras carreras (no con la misma)
        if (carreraId === carreraActualId) return null;
        
        // Verificar en horarios semanales
        if (horario.semanal) {
            const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
            for (let d of dias) {
                const arr = horario.semanal[d] || [];
                const cell = arr[index];
                if (cell && cell.maestroId && cell.materiaId) {
                    // Conflicto de maestro: el mismo maestro no puede estar en dos carreras diferentes a la misma hora
                    if (cell.maestroId === maestroId) {
                        return {
                            tipo: 'maestro',
                            carreraConflicto: carreraId,
                            dia: d,
                            hora: tiempoSlot,
                            maestro: maestro.nombre
                        };
                    }
                    
                    // Conflicto de aula: la misma aula no puede tener dos materias diferentes al mismo tiempo
                    if (materia.aula && cell.materiaId !== materiaId) {
                        const materiaConflicto = materias.find(m => m.id === cell.materiaId);
                        if (materiaConflicto && materiaConflicto.aula === materia.aula) {
                            return {
                                tipo: 'aula',
                                carreraConflicto: carreraId,
                                dia: d,
                                hora: tiempoSlot,
                                aula: materia.aula
                            };
                        }
                    }
                }
            }
        }
        
        // Verificar en horarios sabatinos
        if (horario.sabatino && dia === 'sabado') {
            const cell = horario.sabatino[index];
            if (cell && cell.maestroId && cell.materiaId) {
                // Conflicto de maestro
                if (cell.maestroId === maestroId) {
                    return {
                        tipo: 'maestro',
                        carreraConflicto: carreraId,
                        dia: 'sabado',
                        hora: tiempoSlot,
                        maestro: maestro.nombre
                    };
                }
                
                // Conflicto de aula
                if (materia.aula && cell.materiaId !== materiaId) {
                    const materiaConflicto = materias.find(m => m.id === cell.materiaId);
                    if (materiaConflicto && materiaConflicto.aula === materia.aula) {
                        return {
                            tipo: 'aula',
                            carreraConflicto: carreraId,
                            dia: 'sabado',
                            hora: tiempoSlot,
                            aula: materia.aula
                        };
                    }
                }
            }
        }
        
        return null;
    }

    // Verificar conflictos con todos los horarios guardados
    const carreras = safeGetArray('carreras');
    for (let horario of horariosGuardados) {
        const conflicto = verificarConflictoEnHorario(horario, horario.carreraId);
        if (conflicto) {
            const carreraConflicto = carreras.find(c => c.id === conflicto.carreraConflicto);
            const nombreCarreraConflicto = carreraConflicto ? 
                `${carreraConflicto.nombre} (${carreraConflicto.grado || '-'}-${carreraConflicto.grupo || '-'})` : 
                'Carrera desconocida';
            
            if (conflicto.tipo === 'maestro') {
                alert(`CONFLICTO: El maestro "${conflicto.maestro}" ya está asignado en "${nombreCarreraConflicto}" el día ${conflicto.dia} a las ${conflicto.hora}. Un maestro no puede estar en dos lugares al mismo tiempo.`);
            } else if (conflicto.tipo === 'aula') {
                alert(`CONFLICTO: El aula "${conflicto.aula}" ya está ocupada en "${nombreCarreraConflicto}" el día ${conflicto.dia} a las ${conflicto.hora}.`);
            }
            return;
        }
    }

    // Si no hay conflictos, proceder con la asignación
    celda.dataset.materiaId = materiaI
