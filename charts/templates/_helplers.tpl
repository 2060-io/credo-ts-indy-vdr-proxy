{{- define "indy-vdr-proxy.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{- define "indy-vdr-proxy.fullname" -}}
{{- printf "%s" .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "indy-vdr-proxy.labels" -}}
helm.sh/chart: {{ include "indy-vdr-proxy.name" . }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "indy-vdr-proxy.selectorLabels" -}}
app.kubernetes.io/name: {{ include "indy-vdr-proxy.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
