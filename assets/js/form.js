const statusEl = document.getElementById("status");
const formEl = document.getElementById("form");
let currentData = null;

function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = "status show " + type;
  if (type === "ok") setTimeout(() => statusEl.classList.remove("show"), 2500);
}

async function loadProject() {
  try {
    showStatus("جاري التحميل...", "info");
    const res = await fetch("api/load.php", { cache: "no-store" });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    currentData = data;
    buildForm(data);
    showStatus("تم التحميل بنجاح", "ok");
  } catch (e) {
    showStatus("فشل التحميل: " + e.message, "err");
  }
}

function buildForm(data) {
  formEl.innerHTML = "";
  Object.entries(data).forEach(([key, value]) => {
    formEl.appendChild(buildSection(key, value));
  });
}

function buildSection(key, value) {
  const sec = document.createElement("section");
  sec.className = "card";
  sec.innerHTML = "<h2>" + labelOf(key) + "</h2>";

  if (Array.isArray(value)) {
    sec.appendChild(buildArrayField(key, value));
  } else if (value !== null && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      const f = buildField(key + "." + k, k, v);
      if (f) sec.appendChild(f);
    });
  } else {
    const f = buildField(key, key, value);
    if (f) sec.appendChild(f);
  }
  return sec;
}

function buildField(path, key, value) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const div = document.createElement("div");
    div.className = "nested";
    const title = document.createElement("h4");
    title.textContent = labelOf(key);
    title.style.margin = "8px 0 4px 0";
    title.style.color = "var(--accent)";
    div.appendChild(title);

    Object.entries(value).forEach(([k, v]) => {
      const f = buildField(path + "." + k, k, v);
      if (f) div.appendChild(f);
    });
    return div;
  }

  const grp = document.createElement("div");
  grp.className = "form-group";
  const lbl = document.createElement("label");
  lbl.textContent = labelOf(key);
  lbl.setAttribute("for", "f_" + path);
  grp.appendChild(lbl);

  let input;
  if (typeof value === "boolean") {
    input = document.createElement("select");
    input.innerHTML = '<option value="true">نعم</option><option value="false">لا</option>';
    input.value = String(value);
    input.dataset.type = "boolean";
  } else if (typeof value === "number" || value === null) {
    input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.value = value === null ? "" : value;
    input.dataset.type = "number";
  } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    input = document.createElement("input");
    input.type = "date";
    input.value = value;
    input.dataset.type = "string";
  } else {
    input = document.createElement("input");
    input.type = "text";
    input.value = value === null ? "" : value;
    input.dataset.type = "string";
  }

  input.id = "f_" + path;
  input.dataset.path = path;
  input.name = path;
  grp.appendChild(input);
  return grp;
}

function buildArrayField(path, arr) {
  const wrap = document.createElement("div");
  wrap.className = "array-container";
  wrap.dataset.arrayPath = path;

  const isObjectArray = arr.length > 0 && typeof arr[0] === "object" && arr[0] !== null;
  wrap.dataset.arrayType = isObjectArray ? "objects" : "strings";

  const listWrap = document.createElement("div");
  listWrap.className = "array-list";
  wrap.appendChild(listWrap);

  const renderItem = (item) => {
    const itemWrap = document.createElement("div");
    itemWrap.className = "array-item-card card";
    itemWrap.style.background = "#020617";
    itemWrap.style.border = "1px solid var(--border)";
    itemWrap.style.padding = "12px";
    itemWrap.style.marginBottom = "10px";

    if (isObjectArray) {
      itemWrap.classList.add("array-obj-item");
      Object.entries(item).forEach(([k, v]) => {
        const row = document.createElement("div");
        row.className = "form-group";
        const lbl = document.createElement("label");
        lbl.textContent = labelOf(k);
        row.appendChild(lbl);

        let inp;
        if (typeof v === "boolean") {
          inp = document.createElement("select");
          inp.innerHTML = '<option value="true">نعم</option><option value="false">لا</option>';
          inp.value = String(v);
          inp.dataset.type = "boolean";
        } else if (typeof v === "number") {
          inp = document.createElement("input");
          inp.type = "number";
          inp.value = v;
          inp.dataset.type = "number";
        } else {
          inp = document.createElement("input");
          inp.type = "text";
          inp.value = v || "";
          inp.dataset.type = "string";
        }
        inp.dataset.key = k;
        row.appendChild(inp);
        itemWrap.appendChild(row);
      });
    } else {
      itemWrap.classList.add("array-str-item");
      const row = document.createElement("div");
      row.className = "array-item";
      const inp = document.createElement("input");
      inp.type = "text";
      inp.value = item || "";
      inp.dataset.arrayStrInput = "true";
      row.appendChild(inp);
      itemWrap.appendChild(row);
    }

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "danger";
    delBtn.style.marginTop = "8px";
    delBtn.style.background = "var(--danger)";
    delBtn.style.color = "#fff";
    delBtn.textContent = "🗑️ حذف العنصر";
    delBtn.onclick = () => itemWrap.remove();
    itemWrap.appendChild(delBtn);

    listWrap.appendChild(itemWrap);
  };

  arr.forEach(renderItem);

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "secondary";
  addBtn.textContent = "+ إضافة عنصر جديد";
  addBtn.onclick = () => {
    if (isObjectArray) {
      const template = JSON.parse(JSON.stringify(arr[0] || {}));
      Object.keys(template).forEach(k => {
        if (typeof template[k] === "number") template[k] = 0;
        else if (typeof template[k] === "boolean") template[k] = false;
        else template[k] = "";
      });
      renderItem(template);
    } else {
      renderItem("");
    }
  };
  wrap.appendChild(addBtn);

  return wrap;
}

function collectForm() {
  const data = JSON.parse(JSON.stringify(currentData));

  // Collect standard single inputs
  formEl.querySelectorAll("input[data-path], select[data-path]").forEach((el) => {
    const path = el.dataset.path;
    let val;
    if (el.dataset.type === "boolean") val = el.value === "true";
    else if (el.dataset.type === "number") val = el.value === "" ? null : Number(el.value);
    else val = el.value;
    setPath(data, path, val);
  });

  // Collect array fields
  formEl.querySelectorAll("[data-array-path]").forEach((wrap) => {
    const path = wrap.dataset.arrayPath;
    const arrayType = wrap.dataset.arrayType;

    if (arrayType === "objects") {
      const list = [];
      wrap.querySelectorAll(".array-obj-item").forEach((itemCard) => {
        const obj = {};
        itemCard.querySelectorAll("[data-key]").forEach((inp) => {
          const key = inp.dataset.key;
          let val;
          if (inp.dataset.type === "boolean") val = inp.value === "true";
          else if (inp.dataset.type === "number") val = inp.value === "" ? 0 : Number(inp.value);
          else val = inp.value;
          obj[key] = val;
        });
        list.push(obj);
      });
      setPath(data, path, list);
    } else if (arrayType === "strings") {
      const list = [];
      wrap.querySelectorAll("input[data-array-str-input]").forEach((inp) => {
        if (inp.value.trim() !== "") list.push(inp.value.trim());
      });
      setPath(data, path, list);
    }
  });

  return data;
}

function setPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined || typeof cur[parts[i]] !== "object") {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

async function saveForm() {
  try {
    const data = collectForm();
    data.meta.updated_at = new Date().toISOString().slice(0, 10);
    showStatus("جاري الحفظ...", "info");
    const res = await fetch("api/save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (!out.ok) throw new Error(out.error || "فشل الحفظ");
    currentData = data;
    showStatus("✅ تم الحفظ بنجاح وتحديث البيانات", "ok");
  } catch (e) {
    showStatus("❌ فشل الحفظ: " + e.message, "err");
  }
}

function reloadForm() {
  if (confirm("إلغاء التعديلات وإعادة التحميل؟")) loadProject();
}

function exportJSON() {
  const data = collectForm();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (data.meta?.project_id || "project") + "-export.json";
  a.click();
  URL.revokeObjectURL(url);
}

loadProject();