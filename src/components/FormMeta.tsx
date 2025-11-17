import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface FormMetaProps {
  metaId?: string;
  onSave: (data: MetaFormData) => void;
  onCancel: () => void;
}

export interface MetaFormData {
  kpi: string;
  baseline: string;
  meta: string;
  prazo: string;
  fonte: string;
}

export function FormMeta({ metaId, onSave, onCancel }: FormMetaProps) {
  const isEdit = !!metaId;
  
  const [formData, setFormData] = useState<MetaFormData>({
    kpi: isEdit ? "Contratos Ativos" : "",
    baseline: isEdit ? "120" : "",
    meta: isEdit ? "150" : "",
    prazo: isEdit ? "2025-12-31" : "",
    fonte: isEdit ? "crm" : "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MetaFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof MetaFormData, string>> = {};

    if (!formData.kpi.trim()) {
      newErrors.kpi = "Nome do KPI é obrigatório";
    }
    if (!formData.baseline || parseFloat(formData.baseline) < 0) {
      newErrors.baseline = "Baseline deve ser um número válido";
    }
    if (!formData.meta || parseFloat(formData.meta) < 0) {
      newErrors.meta = "Meta deve ser um número válido";
    }
    if (!formData.prazo) {
      newErrors.prazo = "Prazo é obrigatório";
    }
    if (!formData.fonte) {
      newErrors.fonte = "Fonte de dados é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Editar Meta" : "Nova Meta"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* KPI Name */}
              <div>
                <Label htmlFor="kpi">Nome do KPI *</Label>
                <Input
                  id="kpi"
                  value={formData.kpi}
                  onChange={(e) => setFormData({ ...formData, kpi: e.target.value })}
                  placeholder="Ex: Contratos Ativos"
                  className={errors.kpi ? "border-red-500" : ""}
                />
                {errors.kpi && (
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">{errors.kpi}</p>
                )}
              </div>

              {/* Baseline */}
              <div>
                <Label htmlFor="baseline">Baseline (Valor Inicial) *</Label>
                <Input
                  id="baseline"
                  type="number"
                  value={formData.baseline}
                  onChange={(e) => setFormData({ ...formData, baseline: e.target.value })}
                  placeholder="Ex: 120"
                  className={errors.baseline ? "border-red-500" : ""}
                />
                {errors.baseline && (
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">{errors.baseline}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Valor de referência inicial para comparação
                </p>
              </div>

              {/* Meta */}
              <div>
                <Label htmlFor="meta">Meta (Objetivo) *</Label>
                <Input
                  id="meta"
                  type="number"
                  value={formData.meta}
                  onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                  placeholder="Ex: 150"
                  className={errors.meta ? "border-red-500" : ""}
                />
                {errors.meta && (
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">{errors.meta}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Valor alvo que deseja alcançar
                </p>
              </div>

              {/* Prazo */}
              <div>
                <Label htmlFor="prazo">Prazo *</Label>
                <Input
                  id="prazo"
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                  className={errors.prazo ? "border-red-500" : ""}
                />
                {errors.prazo && (
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">{errors.prazo}</p>
                )}
              </div>

              {/* Fonte */}
              <div>
                <Label htmlFor="fonte">Fonte de Dados *</Label>
                <Select
                  value={formData.fonte}
                  onValueChange={(value) => setFormData({ ...formData, fonte: value })}
                >
                  <SelectTrigger className={errors.fonte ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione a fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crm">Sistema CRM</SelectItem>
                    <SelectItem value="financeiro">Sistema Financeiro</SelectItem>
                    <SelectItem value="analytics">Google Analytics</SelectItem>
                    <SelectItem value="pesquisa">Pesquisa de Satisfação</SelectItem>
                    <SelectItem value="manual">Entrada Manual</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fonte && (
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">{errors.fonte}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#003366] hover:bg-[#004080]"
                >
                  Salvar Meta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}