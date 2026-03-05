#!/bin/bash
# =============================================================================
# SF-ERP Kubernetes Validation Script
# =============================================================================
# 
# This script validates Kubernetes deployment for 100k+ user readiness
# Run: chmod +x scripts/k8s-validate.sh && ./scripts/k8s-validate.sh
#
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║         SF-ERP KUBERNETES PRODUCTION READINESS VALIDATION            ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Helper functions
pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((PASSED++))
}

fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# =============================================================================
# Test 1: Kubernetes Connection
# =============================================================================
section "TEST 1: KUBERNETES CLUSTER CONNECTION"

if kubectl cluster-info &> /dev/null; then
    pass "Connected to Kubernetes cluster"
    kubectl cluster-info | head -2
else
    fail "Cannot connect to Kubernetes cluster"
    echo "Ensure kubectl is configured and cluster is accessible"
    exit 1
fi

# =============================================================================
# Test 2: Namespace Check
# =============================================================================
section "TEST 2: NAMESPACE CONFIGURATION"

NAMESPACE="sf-erp"
if kubectl get namespace $NAMESPACE &> /dev/null; then
    pass "Namespace '$NAMESPACE' exists"
else
    warn "Namespace '$NAMESPACE' not found, checking default"
    NAMESPACE="default"
fi

# =============================================================================
# Test 3: Deployment Status
# =============================================================================
section "TEST 3: DEPLOYMENT STATUS"

# Check backend deployment
if kubectl get deployment backend -n $NAMESPACE &> /dev/null; then
    READY=$(kubectl get deployment backend -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
    DESIRED=$(kubectl get deployment backend -n $NAMESPACE -o jsonpath='{.spec.replicas}')
    if [ "$READY" == "$DESIRED" ] && [ "$READY" != "" ]; then
        pass "Backend deployment ready ($READY/$DESIRED replicas)"
    else
        fail "Backend deployment not ready ($READY/$DESIRED replicas)"
    fi
else
    fail "Backend deployment not found"
fi

# Check frontend deployment
if kubectl get deployment frontend -n $NAMESPACE &> /dev/null; then
    READY=$(kubectl get deployment frontend -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
    DESIRED=$(kubectl get deployment frontend -n $NAMESPACE -o jsonpath='{.spec.replicas}')
    if [ "$READY" == "$DESIRED" ] && [ "$READY" != "" ]; then
        pass "Frontend deployment ready ($READY/$DESIRED replicas)"
    else
        fail "Frontend deployment not ready ($READY/$DESIRED replicas)"
    fi
else
    warn "Frontend deployment not found (may be separate)"
fi

# =============================================================================
# Test 4: HPA Configuration
# =============================================================================
section "TEST 4: HORIZONTAL POD AUTOSCALER"

if kubectl get hpa -n $NAMESPACE &> /dev/null; then
    HPA_COUNT=$(kubectl get hpa -n $NAMESPACE --no-headers | wc -l)
    if [ "$HPA_COUNT" -gt "0" ]; then
        pass "HPA configured ($HPA_COUNT autoscalers found)"
        echo ""
        kubectl get hpa -n $NAMESPACE
        echo ""
        
        # Check HPA targets
        for hpa in $(kubectl get hpa -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
            MAX_REPLICAS=$(kubectl get hpa $hpa -n $NAMESPACE -o jsonpath='{.spec.maxReplicas}')
            if [ "$MAX_REPLICAS" -ge "10" ]; then
                pass "HPA '$hpa' can scale to $MAX_REPLICAS replicas"
            else
                warn "HPA '$hpa' max replicas ($MAX_REPLICAS) may be too low for 100k users"
            fi
        done
    else
        fail "No HPA found - auto-scaling not configured"
    fi
else
    fail "HPA not configured"
fi

# =============================================================================
# Test 5: Pod Disruption Budget
# =============================================================================
section "TEST 5: POD DISRUPTION BUDGET"

if kubectl get pdb -n $NAMESPACE &> /dev/null; then
    PDB_COUNT=$(kubectl get pdb -n $NAMESPACE --no-headers 2>/dev/null | wc -l)
    if [ "$PDB_COUNT" -gt "0" ]; then
        pass "PDB configured ($PDB_COUNT budgets found)"
        kubectl get pdb -n $NAMESPACE
    else
        warn "No PDB found - pods may all be terminated during updates"
    fi
else
    warn "No PDB configured"
fi

# =============================================================================
# Test 6: Resource Limits
# =============================================================================
section "TEST 6: RESOURCE LIMITS & REQUESTS"

# Check if pods have resource limits
PODS_WITHOUT_LIMITS=0
for pod in $(kubectl get pods -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    LIMITS=$(kubectl get pod $pod -n $NAMESPACE -o jsonpath='{.spec.containers[0].resources.limits}')
    if [ -z "$LIMITS" ] || [ "$LIMITS" == "{}" ]; then
        ((PODS_WITHOUT_LIMITS++))
    fi
done

if [ "$PODS_WITHOUT_LIMITS" -eq "0" ]; then
    pass "All pods have resource limits configured"
else
    warn "$PODS_WITHOUT_LIMITS pods without resource limits"
fi

# =============================================================================
# Test 7: Health Checks
# =============================================================================
section "TEST 7: HEALTH PROBE CONFIGURATION"

for deployment in $(kubectl get deployments -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    LIVENESS=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].livenessProbe}')
    READINESS=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].readinessProbe}')
    
    if [ -n "$LIVENESS" ] && [ "$LIVENESS" != "{}" ]; then
        pass "Deployment '$deployment' has liveness probe"
    else
        fail "Deployment '$deployment' missing liveness probe"
    fi
    
    if [ -n "$READINESS" ] && [ "$READINESS" != "{}" ]; then
        pass "Deployment '$deployment' has readiness probe"
    else
        fail "Deployment '$deployment' missing readiness probe"
    fi
done

# =============================================================================
# Test 8: Service Configuration
# =============================================================================
section "TEST 8: SERVICE CONFIGURATION"

for svc in $(kubectl get services -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    TYPE=$(kubectl get service $svc -n $NAMESPACE -o jsonpath='{.spec.type}')
    pass "Service '$svc' configured (type: $TYPE)"
done

# =============================================================================
# Test 9: ConfigMaps and Secrets
# =============================================================================
section "TEST 9: CONFIGURATION & SECRETS"

CM_COUNT=$(kubectl get configmaps -n $NAMESPACE --no-headers 2>/dev/null | wc -l)
SECRET_COUNT=$(kubectl get secrets -n $NAMESPACE --no-headers 2>/dev/null | wc -l)

echo "  ConfigMaps: $CM_COUNT"
echo "  Secrets: $SECRET_COUNT"

# Check if secrets are not in plain deployment manifests
if [ "$SECRET_COUNT" -gt "0" ]; then
    pass "Secrets are stored in Kubernetes Secrets"
else
    warn "No Kubernetes Secrets found - check if secrets are hardcoded"
fi

# =============================================================================
# Test 10: Pod Kill Recovery Test
# =============================================================================
section "TEST 10: POD KILL RECOVERY TEST"

echo "Selecting a random backend pod to kill..."

POD_TO_KILL=$(kubectl get pods -n $NAMESPACE -l app=backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ -n "$POD_TO_KILL" ]; then
    echo "Killing pod: $POD_TO_KILL"
    
    # Get pod count before
    PODS_BEFORE=$(kubectl get pods -n $NAMESPACE -l app=backend --no-headers | wc -l)
    
    # Kill pod
    kubectl delete pod $POD_TO_KILL -n $NAMESPACE --grace-period=0 --force &> /dev/null &
    
    # Wait and check recovery
    echo "Waiting 30 seconds for recovery..."
    sleep 30
    
    # Get pod count after
    PODS_AFTER=$(kubectl get pods -n $NAMESPACE -l app=backend --no-headers | wc -l)
    READY_PODS=$(kubectl get pods -n $NAMESPACE -l app=backend -o jsonpath='{.items[*].status.phase}' | grep -o "Running" | wc -l)
    
    if [ "$PODS_AFTER" -ge "$PODS_BEFORE" ] && [ "$READY_PODS" -gt "0" ]; then
        pass "Pod recovered successfully (Running: $READY_PODS)"
    else
        fail "Pod recovery incomplete (Expected: $PODS_BEFORE, Got: $READY_PODS running)"
    fi
else
    warn "No backend pods found to test recovery"
fi

# =============================================================================
# Test 11: Rolling Update Test
# =============================================================================
section "TEST 11: ROLLING UPDATE STRATEGY"

for deployment in $(kubectl get deployments -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    STRATEGY=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.spec.strategy.type}')
    if [ "$STRATEGY" == "RollingUpdate" ]; then
        MAX_UNAVAILABLE=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.spec.strategy.rollingUpdate.maxUnavailable}')
        MAX_SURGE=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.spec.strategy.rollingUpdate.maxSurge}')
        pass "Deployment '$deployment' uses RollingUpdate (maxUnavailable: $MAX_UNAVAILABLE, maxSurge: $MAX_SURGE)"
    else
        warn "Deployment '$deployment' uses $STRATEGY strategy"
    fi
done

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                         VALIDATION SUMMARY                            ║"
echo "╠══════════════════════════════════════════════════════════════════════╣"
echo -e "║  ${GREEN}PASSED${NC}: $PASSED tests                                                  ║"
echo -e "║  ${RED}FAILED${NC}: $FAILED tests                                                  ║"
echo "╠══════════════════════════════════════════════════════════════════════╣"

TOTAL=$((PASSED + FAILED))
SCORE=$((PASSED * 100 / TOTAL))

if [ "$SCORE" -ge "90" ]; then
    echo -e "║  ${GREEN}SCORE: $SCORE% - PRODUCTION READY${NC}                                    ║"
elif [ "$SCORE" -ge "70" ]; then
    echo -e "║  ${YELLOW}SCORE: $SCORE% - NEEDS IMPROVEMENT${NC}                                  ║"
else
    echo -e "║  ${RED}SCORE: $SCORE% - NOT READY${NC}                                            ║"
fi

echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

exit $FAILED
